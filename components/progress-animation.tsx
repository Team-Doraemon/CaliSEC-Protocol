"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ProgressAnimationProps {
  steps: string[]
  isActive: boolean
}

const ProgressAnimation: React.FC<ProgressAnimationProps> = ({ steps, isActive }) => {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isActive && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isActive, currentStep, steps.length])

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0)
    }
  }, [isActive])

  return (
    <div className="fixed bottom-16 left-0 right-0 flex justify-center items-center h-16 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {isActive &&
          steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: index === currentStep ? 0 : index < currentStep ? "100%" : "-100%",
                opacity: index === currentStep ? 1 : 0,
              }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-green-400 text-xl font-semibold bg-[#111111]/80 backdrop-blur-md px-6 py-3 rounded-full absolute"
            >
              {step}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

export default ProgressAnimation

