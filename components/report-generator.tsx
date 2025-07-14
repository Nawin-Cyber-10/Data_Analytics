"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, FileSpreadsheet, Mail, Share2 } from "lucide-react"
import { generatePDFReport } from "@/lib/report-generator"
import { generateExcelReport } from "@/lib/excel-generator"
import { generateExecutiveSummary } from "@/lib/ai-insights"
import type { AnalysisData } from "@/app/page"
import { useToast } from "@/components/error-toast" // Import useToast

interface ReportGeneratorProps {
  data: AnalysisData
  onError: (error: string, context?: string) => void // Added onError prop
  setLoadingStage: (stage: string) => void // Added setLoadingStage prop
}

export function ReportGenerator({ data, onError, setLoadingStage }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null)
  const { showApiQuotaWarning } = useToast() // Use the toast hook

  const handleGeneratePDF = async () => {
    setIsGenerating("pdf")
    setLoadingStage("Generating PDF Report...")
    try {
      await generatePDFReport(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate PDF report"
      console.error("PDF generation failed:", error)
      onError(errorMessage, "pdf-report") // Use onError prop
    } finally {
      setIsGenerating(null)
      setLoadingStage("")
    }
  }

  const handleGenerateExcel = async () => {
    setIsGenerating("excel")
    setLoadingStage("Generating Excel Report...")
    try {
      await generateExcelReport(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate Excel report"
      console.error("Excel generation failed:", error)
      onError(errorMessage, "excel-report") // Use onError prop
    } finally {
      setIsGenerating(null)
      setLoadingStage("")
    }
  }

  const handleGenerateExecutiveSummary = async () => {
    setIsGenerating("summary")
    setLoadingStage("Generating AI Executive Summary...")
    try {
      const summary = await generateExecutiveSummary(data)
      setExecutiveSummary(summary)
      // Check if fallback was used for AI insights
      if (summary.includes("EXECUTIVE SUMMARY\nAdvanced Data Analytics Report")) {
        showApiQuotaWarning()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate executive summary"
      console.error("Executive summary generation failed:", error)
      onError(errorMessage, "executive-summary") // Use onError prop
    } finally {
      setIsGenerating(null)
      setLoadingStage("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
          <CardDescription>Generate comprehensive reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="font-semibold">PDF Report</h3>
                    <p className="text-sm text-gray-600">Comprehensive analysis report</p>
                  </div>
                </div>
                <Button onClick={handleGeneratePDF} disabled={isGenerating === "pdf"} className="w-full">
                  {isGenerating === "pdf" ? "Generating..." : "Generate PDF"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Excel Report</h3>
                    <p className="text-sm text-gray-600">Data with analysis sheets</p>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateExcel}
                  disabled={isGenerating === "excel"}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {isGenerating === "excel" ? "Generating..." : "Generate Excel"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>AI-generated executive summary of your analysis</CardDescription>
        </CardHeader>
        <CardContent>
          {executiveSummary ? (
            <div className="space-y-4">
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700">{executiveSummary}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Summary
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Button onClick={handleGenerateExecutiveSummary} disabled={isGenerating === "summary"} size="lg">
                {isGenerating === "summary" ? "Generating Summary..." : "Generate Executive Summary"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Data Overview & Statistics</span>
              <Badge variant="secondary">Included</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Correlation Analysis</span>
              <Badge variant="secondary">Included</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Trend Analysis</span>
              <Badge variant="secondary">Included</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Machine Learning Insights</span>
              <Badge variant="secondary">Included</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Interactive Visualizations</span>
              <Badge variant="secondary">Included</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>AI-Generated Recommendations</span>
              <Badge variant="secondary">Included</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
