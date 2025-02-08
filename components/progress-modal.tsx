"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface ProgressModalProps {
  open: boolean
  onClose: () => void
  steps: string[]
}

export default function ProgressModal({ open, onClose, steps }: ProgressModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (open && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    }

    if (currentStep === steps.length) {
      const timer = setTimeout(onClose, 1000)
      return () => clearTimeout(timer)
    }
  }, [open, currentStep, steps.length, onClose])

  useEffect(() => {
    if (open) setCurrentStep(0)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-[#222] text-white sm:max-w-md">
        <div className="py-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            <div className="text-center space-y-2">
              {steps.map((step, index) => (
                <p
                  key={index}
                  className={`text-sm transition-colors ${
                    index === currentStep ? "text-green-400" : index < currentStep ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

