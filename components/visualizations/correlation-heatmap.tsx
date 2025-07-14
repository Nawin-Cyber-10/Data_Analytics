"use client"

import { ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CorrelationData {
  x: string
  y: string
  correlation: number
}

interface CorrelationHeatmapProps {
  correlations: CorrelationData[]
}

export function CorrelationHeatmap({ correlations }: CorrelationHeatmapProps) {
  // Create a matrix-like structure for the heatmap
  const variables = Array.from(new Set([...correlations.map((c) => c.x), ...correlations.map((c) => c.y)]))

  const heatmapData = variables.flatMap((x) =>
    variables.map((y) => {
      const correlation = correlations.find((c) => (c.x === x && c.y === y) || (c.x === y && c.y === x))
      return {
        x,
        y,
        value: correlation ? correlation.correlation : x === y ? 1 : 0,
      }
    }),
  )

  const getColor = (value: number) => {
    const intensity = Math.abs(value)
    if (value > 0) {
      return `rgba(59, 130, 246, ${intensity})` // Blue for positive
    } else {
      return `rgba(239, 68, 68, ${intensity})` // Red for negative
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correlation Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${variables.length}, 1fr)` }}>
              {heatmapData.map((item, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center text-xs font-medium rounded border"
                  style={{ backgroundColor: getColor(item.value) }}
                  title={`${item.x} × ${item.y}: ${item.value.toFixed(3)}`}
                >
                  {Math.abs(item.value) > 0.1 && (
                    <span className={Math.abs(item.value) > 0.5 ? "text-white" : "text-gray-700"}>
                      {item.value.toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Negative Correlation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Positive Correlation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
