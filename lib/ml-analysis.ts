import type { AnalysisData } from "@/app/page"

export async function performMLAnalysis(data: AnalysisData) {
  // Simulate ML analysis - in a real app, this would use actual ML libraries
  const correlations = calculateCorrelations(data)
  const trends = analyzeTrends(data)
  const clusters = performClustering(data)

  return {
    correlations,
    trends,
    clusters,
  }
}

function calculateCorrelations(data: AnalysisData) {
  const correlations = []
  const numericColumns = data.summary.numericColumns

  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i]
      const col2 = numericColumns[j]

      const values1 = data.data.map((row) => Number(row[col1])).filter((v) => !isNaN(v))
      const values2 = data.data.map((row) => Number(row[col2])).filter((v) => !isNaN(v))

      if (values1.length > 10 && values2.length > 10) {
        const correlation = pearsonCorrelation(values1, values2)
        if (Math.abs(correlation) > 0.3) {
          correlations.push({
            x: col1,
            y: col2,
            correlation,
          })
        }
      }
    }
  }

  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  if (n < 2) return 0

  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0)
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0)
  const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0)
  const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}

function analyzeTrends(data: AnalysisData) {
  const trends = []

  for (const column of data.summary.numericColumns) {
    const values = data.data.map((row) => Number(row[column])).filter((v) => !isNaN(v))
    if (values.length < 10) continue

    // Simple trend analysis using linear regression slope
    const n = values.length
    const indices = Array.from({ length: n }, (_, i) => i)

    const sumX = indices.reduce((a, b) => a + b, 0)
    const sumY = values.reduce((a, b) => a + b, 0)
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0)
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

    let trend: "increasing" | "decreasing" | "stable"
    if (Math.abs(slope) < 0.01) {
      trend = "stable"
    } else if (slope > 0) {
      trend = "increasing"
    } else {
      trend = "decreasing"
    }

    trends.push({ column, trend })
  }

  return trends
}

function performClustering(data: AnalysisData) {
  // Simplified k-means clustering simulation
  const numericColumns = data.summary.numericColumns
  if (numericColumns.length < 2) return []

  const k = Math.min(4, Math.floor(Math.sqrt(data.data.length / 2)))
  const clusters = []

  for (let i = 0; i < k; i++) {
    clusters.push({
      cluster: i,
      size: Math.floor(data.data.length / k) + (Math.random() * 20 - 10),
      centroid: numericColumns.map(() => Math.random() * 100),
    })
  }

  return clusters
}
