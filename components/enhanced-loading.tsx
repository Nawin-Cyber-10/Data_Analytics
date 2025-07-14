"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Brain, BarChart3, Zap } from "lucide-react"

interface EnhancedLoadingProps {
  message?: string
  progress?: number
  stage?: string
  showProgress?: boolean
}

const loadingStages = [
  { icon: Loader2, message: "Processing your data...", color: "text-blue-500" },
  { icon: Brain, message: "Analyzing patterns...", color: "text-purple-500" },
  { icon: BarChart3, message: "Generating insights...", color: "text-green-500" },
  { icon: Zap, message: "Finalizing results...", color: "text-orange-500" },
]

export function EnhancedLoading({
  message = "Processing...",
  progress,
  stage,
  showProgress = false,
}: EnhancedLoadingProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (!showProgress) {
      const interval = setInterval(() => {
        setCurrentStage((prev) => (prev + 1) % loadingStages.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [showProgress])

  useEffect(() => {
    if (progress !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [progress])

  const currentStageData = loadingStages[currentStage]
  const IconComponent = currentStageData.icon

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/95 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <IconComponent className={`w-8 h-8 text-white animate-spin ${currentStageData.color}`} />
              </div>
            </div>

            {/* Loading Message */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">{stage || currentStageData.message}</h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <div className="w-full space-y-2">
                <Progress value={animatedProgress} className="h-2 bg-gray-200" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{Math.round(animatedProgress)}%</span>
                </div>
              </div>
            )}

            {/* Loading Dots */}
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
