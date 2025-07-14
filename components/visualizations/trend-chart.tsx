"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DataRow } from "@/app/page"

interface TrendData {
  column: string
  trend: "increasing" | "decreasing" | "stable"
}

interface TrendChartProps {
  data: DataRow[]
  trends: TrendData[]
}

export function TrendChart({ data, trends }: TrendChartProps) {
  // Prepare data for the chart - sample every nth point to avoid overcrowding
  const sampleSize = Math.min(50, data.length)
  const step = Math.floor(data.length / sampleSize)
  const sampledData = data
    .filter((_, index) => index % step === 0)
    .map((row, index) => ({
      index,
      ...trends.reduce(
        (acc, trend) => ({
          ...acc,
          [trend.column]: Number(row[trend.column]) || 0,
        }),
        {},
      ),
    }))

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampledData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              {trends.map((trend, index) => (
                <Line
                  key={trend.column}
                  type="monotone"
                  dataKey={trend.column}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
