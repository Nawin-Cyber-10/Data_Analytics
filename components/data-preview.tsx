"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, TrendingUp, Database, Sparkles } from "lucide-react"
import { performMLAnalysis } from "@/lib/ml-analysis"
import { generateDetailedInsights } from "@/lib/ai-insights"
import type { AnalysisData } from "@/app/page"
import { useToast } from "@/components/error-toast" // Import useToast

interface DataPreviewProps {
  data: AnalysisData
  onAnalysisComplete: (data: AnalysisData) => void
  onError: (error: string, context?: string) => void // Added onError prop
  setLoadingStage: (stage: string) => void // Added setLoadingStage prop
}

export function DataPreview({ data, onAnalysisComplete, onError, setLoadingStage }: DataPreviewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { showApiQuotaWarning } = useToast() // Use the toast hook

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true)
    setLoadingStage("Running Machine Learning Analysis...")
    try {
      // Perform ML analysis
      const mlAnalysis = await performMLAnalysis(data)
      setLoadingStage("Generating Detailed AI Insights...")

      // Generate detailed AI insights
      const detailedInsights = await generateDetailedInsights(data, mlAnalysis)

      // Check if fallback was used for AI insights
      if (detailedInsights.includes("COMPREHENSIVE ANALYSIS REPORT")) {
        showApiQuotaWarning()
      }

      const updatedData: AnalysisData = {
        ...data,
        mlAnalysis,
        insights: detailedInsights,
      }

      onAnalysisComplete(updatedData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to perform advanced analysis"
      console.error("Analysis failed:", error)
      onError(errorMessage, "ml-analysis") // Use onError prop
    } finally {
      setIsAnalyzing(false)
      setLoadingStage("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{data.summary.totalRows.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Rows</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{data.summary.totalColumns}</p>
                <p className="text-sm text-gray-600">Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{data.summary.numericColumns.length}</p>
                <p className="text-sm text-gray-600">Numeric</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{data.summary.categoricalColumns.length}</p>
                <p className="text-sm text-gray-600">Categorical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Sample</CardTitle>
          <CardDescription>Preview of the first 10 rows from your dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {data.columns.map((column) => (
                    <TableHead key={column} className="whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span>{column}</span>
                        <Badge variant={data.summary.numericColumns.includes(column) ? "default" : "secondary"}>
                          {data.summary.numericColumns.includes(column) ? "Numeric" : "Text"}
                        </Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    {data.columns.map((column) => (
                      <TableCell key={column} className="whitespace-nowrap">
                        {String(row[column])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {data.insights && (
        <Card>
          <CardHeader>
            <CardTitle>Initial AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{data.insights}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ready for Advanced Analysis</CardTitle>
          <CardDescription>Run machine learning analysis and generate detailed insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRunAnalysis} disabled={isAnalyzing} size="lg" className="w-full">
            {isAnalyzing ? "Running Analysis..." : "Run Advanced Analysis"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
