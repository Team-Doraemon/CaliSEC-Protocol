"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, LightbulbIcon } from "lucide-react"
import { createSecret } from "@/lib/api"
import { getRandomSuggestion } from "@/lib/utils"

interface DepositProps {
  onDeposit: (steps: string[]) => void
  onComplete: () => void
}

export default function Deposit({ onDeposit, onComplete }: DepositProps) {
  const [secret, setSecret] = useState("")
  const [generatedProof, setGeneratedProof] = useState("")
  const [copied, setCopied] = useState(false)
  const [suggestion] = useState(getRandomSuggestion)

  const handleDeposit = async () => {
    onDeposit([
      "Encrypting message in Calimero node...",
      "Generating secret proof...",
      "Storing proof in ICP canister...",
      "Finalizing proof creation...",
    ])

    try {
      const result = await createSecret(secret)
      setGeneratedProof(result.proof)
      onComplete()
    } catch (error) {
      // Handle error
      onComplete()
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedProof)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="secret">Message</Label>
        <Input
          id="secret"
          type="password"
          placeholder="Enter your message"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="bg-[#0A0A0A] border-[#222]"
        />
      </div>

      {generatedProof && (
        <div className="space-y-2">
          <Label>Secret Proof</Label>
          <div className="flex gap-2">
            <Input readOnly value={generatedProof} className="bg-[#0A0A0A] border-[#222]" />
            <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={handleDeposit}
        className="w-full bg-green-500 hover:bg-green-600 text-black h-12"
        disabled={!secret}
      >
        Create Secret Proof
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

