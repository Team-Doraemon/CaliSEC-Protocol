import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const suggestions = [
  "Share encrypted secrets within your Calimero context network.",
  "Send private messages that only your context peers can decrypt.",
  "Use zk-proofs for anonymous, verifiable voting in your network.",
  "Securely share token data within your Calimero context.",
  "Prove secret ownership without revealing the data.",
  "Store encrypted notes accessible only in your network.",
  "Use zk-proofs to control access to sensitive info.",
  "Enable private group communication with full encryption.",
  "Exchange cryptographic attestations securely.",
  "Distribute access keys safely within your context.",
]

export function getRandomSuggestion(): string {
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

