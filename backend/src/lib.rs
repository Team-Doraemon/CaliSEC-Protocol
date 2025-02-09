use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::{caller, time};
use ic_cdk::{init, query, update};
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::BTreeMap;

// Types and Structures
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct SecretMessage {
    message: String,
    note_hash: String,
    timestamp: u64,
}

#[derive(Clone, Debug)]
struct MerkleNode {
    hash: String,
    left: Option<Box<MerkleNode>>,
    right: Option<Box<MerkleNode>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Default)]
pub struct Stats {
    total_deposits: u64,
    total_withdrawals: u64,
    unique_users: u64,
}

// State Management
thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(Default)]
struct State {
    messages: BTreeMap<Principal, Vec<SecretMessage>>,
    used_notes: BTreeMap<String, bool>,
    merkle_roots: BTreeMap<Principal, String>,
    stats: Stats,
}

// Initialization
#[init]
fn init() {
    ic_cdk::println!("Initializing Merkle Secret Storage Canister");
}

// Public Methods
#[update]
fn deposit_message(message: String) -> Result<String, String> {
    if message.is_empty() {
        return Err("Message cannot be empty".to_string());
    }

    let caller = caller();
    let note = generate_unique_note();
    let note_hash = hash_string(&note);
    let timestamp = time();

    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        // Store message
        let messages = state.messages.entry(caller).or_default();
        messages.push(SecretMessage {
            message,
            note_hash: note_hash.clone(),
            timestamp,
        });

        // Mark note as unused
        state.used_notes.insert(note_hash.clone(), false);

        // Update stats
        state.stats.total_deposits += 1;
        state.stats.unique_users = state.messages.len() as u64;

        // Generate new merkle root
        generate_merkle_root(&mut state, &caller);
    });

    Ok(note)
}

#[update]
fn withdraw_message(note: String) -> Result<String, String> {
    let caller = caller();
    let note_hash = hash_string(&note);

    // Verify merkle proof
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(root) = state.merkle_roots.get(&caller) {
            let proof = generate_merkle_proof(&state, &caller, &note_hash);
            if !validate_merkle_proof(&note_hash, &proof, root) {
                return Err("Invalid cryptographic proof".to_string());
            }
        } else {
            return Err("No Merkle root found for user".to_string());
        }

        if state.used_notes.get(&note_hash) == Some(&true) {
            return Err("Note has already been used".to_string());
        }
        Ok(())
    })?;

    // Find and process withdrawal
    let message = STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(messages) = state.messages.get_mut(&caller) {
            if let Some(pos) = messages.iter().position(|m| m.note_hash == note_hash) {
                let secret = messages.remove(pos);
                state.used_notes.insert(note_hash, true);
                
                // Update stats
                state.stats.total_withdrawals += 1;
                
                // Update merkle root after removal
                generate_merkle_root(&mut state, &caller);
                
                Some(secret.message)
            } else {
                None
            }
        } else {
            None
        }
    }).ok_or("No matching message found")?;

    Ok(message)
}

// Query Methods
#[query]
fn get_message_count() -> u64 {
    let caller = caller();
    STATE.with(|state| {
        state.borrow().messages
            .get(&caller)
            .map_or(0, |messages| messages.len() as u64)
    })
}

#[query]
fn get_stats() -> Stats {
    STATE.with(|state| state.borrow().stats.clone())
}

#[query]
fn verify_message_ownership(note: String) -> Result<bool, String> {
    let caller = caller();
    let note_hash = hash_string(&note);
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(root) = state.merkle_roots.get(&caller) {
            let proof = generate_merkle_proof(&state, &caller, &note_hash);
            Ok(validate_merkle_proof(&note_hash, &proof, root))
        } else {
            Err("No Merkle root found for user".to_string())
        }
    })
}

// Helper Functions
fn generate_unique_note() -> String {
    let timestamp = time();
    let caller = caller();
    let entropy = hash_string(&format!("{}-{}-{}", caller, timestamp, ic_cdk::id()));
    entropy
}

fn hash_string(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    hex::encode(hasher.finalize())
}

fn generate_merkle_root(state: &mut State, user: &Principal) {
    if let Some(messages) = state.messages.get(user) {
        let hashes: Vec<String> = messages.iter().map(|m| m.note_hash.clone()).collect();
        if !hashes.is_empty() {
            let root = build_merkle_tree(hashes);
            state.merkle_roots.insert(*user, root.hash);
        }
    }
}

fn build_merkle_tree(hashes: Vec<String>) -> MerkleNode {
    if hashes.len() == 1 {
        return MerkleNode {
            hash: hashes[0].clone(),
            left: None,
            right: None,
        };
    }

    let mid = hashes.len() / 2;
    let left = build_merkle_tree(hashes[..mid].to_vec());
    let right = build_merkle_tree(hashes[mid..].to_vec());
    let combined_hash = hash_string(&(left.hash.clone() + &right.hash));

    MerkleNode {
        hash: combined_hash,
        left: Some(Box::new(left)),
        right: Some(Box::new(right)),
    }
}

fn generate_merkle_proof(state: &State, user: &Principal, target_hash: &String) -> Vec<String> {
    if let Some(messages) = state.messages.get(user) {
        let hashes: Vec<String> = messages.iter().map(|m| m.note_hash.clone()).collect();
        if !hashes.is_empty() {
            let root = build_merkle_tree(hashes);
            let mut proof = Vec::new();
            construct_proof_path(&root, target_hash, &mut proof);
            return proof;
        }
    }
    vec![]
}

fn construct_proof_path(node: &MerkleNode, target_hash: &String, proof: &mut Vec<String>) -> bool {
    if node.hash == *target_hash {
        return true;
    }

    if let Some(left) = &node.left {
        if construct_proof_path(left, target_hash, proof) {
            if let Some(right) = &node.right {
                proof.push(right.hash.clone());
            }
            return true;
        }
    }

    if let Some(right) = &node.right {
        if construct_proof_path(right, target_hash, proof) {
            if let Some(left) = &node.left {
                proof.push(left.hash.clone());
            }
            return true;
        }
    }

    false
}

fn validate_merkle_proof(note_hash: &String, proof: &Vec<String>, root_hash: &str) -> bool {
    let mut current_hash = note_hash.clone();
    
    for proof_element in proof {
        current_hash = hash_string(&(current_hash + proof_element));
    }
    
    current_hash == root_hash
}

// Candid interface generation
candid::export_service!();

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}