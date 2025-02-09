import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Stats {
  'total_deposits' : bigint,
  'total_withdrawals' : bigint,
  'unique_users' : bigint,
}
export interface _SERVICE {
  'deposit_message' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'get_message_count' : ActorMethod<[], bigint>,
  'get_stats' : ActorMethod<[], Stats>,
  'verify_message_ownership' : ActorMethod<
    [string],
    { 'Ok' : boolean } |
      { 'Err' : string }
  >,
  'withdraw_message' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
