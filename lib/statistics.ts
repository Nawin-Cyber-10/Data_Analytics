import type { AnalysisData } from "@/app/page"

export function calculateStatistics(data: AnalysisData) {
  const statistics: Record<
    string,
    {
      mean: number
      median: number
      stdDev: number
      min: number
      max: number
      missing: number
    }
  > = {}

  data.summary.numericColumns.forEach((column) => {
    const values = data.data.map((row) => Number(row[column])).filter((v) => !isNaN(v) && v !== null && v !== undefined)

    const missing = data.data.length - values.length

    if (values.length === 0) {
      statistics[column] = {
        mean: 0,
        median: 0,
        stdDev: 0,
        min: 0,
        max: 0,
        missing,
      }
      return
    }

    const sorted = [...values].sort((a, b) => a - b)
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]

    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    statistics[column] = {
      mean,
      median,
      stdDev,
      min: Math.min(...values),
      max: Math.max(...values),
      missing,
    }
  })

  return statistics
}
