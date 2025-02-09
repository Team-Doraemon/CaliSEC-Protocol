"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, LightbulbIcon } from "lucide-react"
import { getRandomSuggestion } from "@/lib/utils"

interface WithdrawProps {
  onWithdraw: (steps: string[]) => void
  onInputWithdraw: (message: string) => Promise<void>; // ✅ Uses handleInputWithdraw
  onComplete: () => void
}

export default function Withdraw({ onWithdraw, onInputWithdraw, onComplete }: WithdrawProps) {
  const [proof, setProof] = useState()
  const [decodedMessage, setDecodedMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [suggestion] = useState(getRandomSuggestion)

  const handleWithdraw = async () => {
    onWithdraw([
      "Verifying secret proof...",
      "Checking ICP canister...",
      "Decoding message in Calimero node...",
      "Retrieving original message...",
    ])

    try {
      const thing = await onInputWithdraw(proof); // ✅ Use actual withdraw function
      setDecodedMessage(thing); // ✅ Set decoded message from proof
      onComplete()
    } catch (error) {
      console.error("Withdraw error:", error);
      onComplete()
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(decodedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="proof">Secret Proof</Label>
        <Input
          id="proof"
          placeholder="Enter your secret proof"
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          className="bg-[#0A0A0A] border-[#222]"
        />
      </div>

      {decodedMessage && (
        <div className="space-y-2">
          <Label>Decoded Message</Label>
          <div className="flex gap-2">
            <Input readOnly value={decodedMessage} className="bg-[#0A0A0A] border-[#222]" />
            <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={handleWithdraw}
        className="w-full bg-green-500 hover:bg-green-600 text-black h-12"
        disabled={!proof}
      >
        Decode Secret Proof
      </Button>

      <div className="rounded-lg bg-[#0A0A0A] p-4 border border-[#222]">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <LightbulbIcon className="w-4 h-4" />
          <h3 className="text-sm font-medium">Suggestion</h3>
        </div>
        <p className="text-sm text-gray-300">{suggestion}</p>
      </div>
    </div>
  )
}