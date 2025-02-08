"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircuitBoard, Lock, Shield } from "lucide-react"

interface AboutModalProps {
  open: boolean
  onClose: () => void
}

const AboutModal: React.FC<AboutModalProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0, y: "100%" }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: "100%" }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-[#222] text-white max-w-2xl rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">About CaliSEC Protocol</h2>
              <div className="grid gap-6">
                <div className="flex gap-4 items-start">
                  <CircuitBoard className="w-8 h-8 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Calimero Private Compute</h3>
                    <p className="text-sm text-gray-400">
                      Calimero nodes provide secure, private computation environments for secret encryption and
                      decryption, ensuring your data never leaves the trusted execution environment.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Shield className="w-8 h-8 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">ICP Canister Storage</h3>
                    <p className="text-sm text-gray-400">
                      Internet Computer Protocol canisters store encrypted proofs in a decentralized manner, providing
                      high availability and tamper-proof storage for your secret references.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Lock className="w-8 h-8 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Zero-Knowledge Technology</h3>
                    <p className="text-sm text-gray-400">
                      Advanced zk-proofs enable secure secret sharing without revealing the underlying data, maintaining
                      complete confidentiality throughout the process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AboutModal

