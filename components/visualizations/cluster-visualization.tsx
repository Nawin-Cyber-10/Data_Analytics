"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DataRow } from "@/app/page"

interface ClusterData {
  cluster: number
  size: number
  centroid: number[]
}

interface ClusterVisualizationProps {
  data: DataRow[]
  clusters: ClusterData[]
  numericColumns: string[]
}

export function ClusterVisualization({ data, clusters, numericColumns }: ClusterVisualizationProps) {
  if (numericColumns.length < 2) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Need at least 2 numeric columns for cluster visualization</p>
        </CardContent>
      </Card>
    )
  }

  // Use first two numeric columns for visualization
  const xColumn = numericColumns[0]
  const yColumn = numericColumns[1]

  // Assign clusters to data points (simplified - in real implementation, this would come from ML algorithm)
  const scatterData = data.slice(0, 200).map((row, index) => ({
    x: Number(row[xColumn]) || 0,
    y: Number(row[yColumn]) || 0,
    cluster: index % clusters.length,
  }))

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Visualization</CardTitle>
        <p className="text-sm text-gray-600">
          Showing {xColumn} vs {yColumn} with {clusters.length} clusters
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name={xColumn} />
              <YAxis dataKey="y" name={yColumn} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [value, name]}
                labelFormatter={() => ""}
              />
              <Scatter dataKey="y" fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.cluster % colors.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
