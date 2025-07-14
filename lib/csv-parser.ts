import type { DataRow, AnalysisData } from "@/app/page"
import { logger } from "./logger"

export function parseCSV(csvText: string): Omit<AnalysisData, "insights" | "mlAnalysis"> {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) {
    logger.error("CSV parsing error: CSV must have at least a header and one data row", { linesCount: lines.length })
    throw new Error("CSV must have at least a header and one data row")
  }

  // Parse header
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  if (headers.some((h) => h === "")) {
    logger.warn("CSV parsing warning: Empty header detected", { headers })
  }

  // Parse data rows
  const data: DataRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

    // Robust validation for consistent column count
    if (values.length !== headers.length) {
      logger.warn(
        `CSV parsing warning: Row ${i + 1} has inconsistent column count. Expected ${headers.length}, got ${values.length}. Skipping row.`,
        {
          row: i + 1,
          expectedColumns: headers.length,
          actualColumns: values.length,
          rowData: lines[i],
        },
      )
      continue // Skip malformed rows
    }

    const row: DataRow = {}
    headers.forEach((header, index) => {
      const value = values[index]
      // Try to convert to number if possible, otherwise keep as string
      const numValue = Number(value)
      row[header] = !isNaN(numValue) && value !== "" ? numValue : value
    })
    data.push(row)
  }

  if (data.length === 0) {
    logger.error("CSV parsing error: No valid data rows found after parsing and validation.")
    throw new Error("No valid data rows found in the CSV file.")
  }

  // Analyze columns
  const numericColumns: string[] = []
  const categoricalColumns: string[] = []

  headers.forEach((header) => {
    // Sample more values for better type inference, or check all if dataset is small
    const sampleSize = Math.min(data.length, 100) // Check up to 100 rows for type inference
    const sampleValues = data.slice(0, sampleSize).map((row) => row[header])

    // Count how many values are numeric
    const numericCount = sampleValues.filter((val) => typeof val === "number").length

    // If a high percentage of sampled values are numeric, consider it a numeric column
    if (numericCount / sampleSize > 0.7) {
      // 70% threshold
      numericColumns.push(header)
    } else {
      categoricalColumns.push(header)
    }
  })

  logger.info("CSV parsing successful", {
    totalRows: data.length,
    totalColumns: headers.length,
    numericColumns: numericColumns.length,
    categoricalColumns: categoricalColumns.length,
  })

  return {
    data,
    columns: headers,
    summary: {
      totalRows: data.length,
      totalColumns: headers.length,
      numericColumns,
      categoricalColumns,
    },
  }
}
