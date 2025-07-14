"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { FileUpload } from "@/components/file-upload"
import { DataPreview } from "@/components/data-preview"
import { AnalysisResults } from "@/components/analysis-results"
import { ReportGenerator } from "@/components/report-generator"
import { EnhancedLoading } from "@/components/enhanced-loading"
import { ErrorBoundary } from "@/components/error-boundary"
import { ToastContainer, useToast } from "@/components/error-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logger } from "@/lib/logger"

export interface DataRow {
  [key: string]: string | number
}

export interface AnalysisData {
  data: DataRow[]
  columns: string[]
  summary: {
    totalRows: number
    totalColumns: number
    numericColumns: string[]
    categoricalColumns: string[]
  }
  insights?: string
  mlAnalysis?: {
    correlations: Array<{ x: string; y: string; correlation: number }>
    clusters?: Array<{ cluster: number; size: number; centroid: number[] }>
    trends?: Array<{ column: string; trend: "increasing" | "decreasing" | "stable" }>
  }
}

function AppContent() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const { showError, showSuccess, showInfo } = useToast()

  const handleDataAnalyzed = (data: AnalysisData) => {
    logger.info("Data analysis completed", {
      rows: data.summary.totalRows,
      columns: data.summary.totalColumns,
    })

    setAnalysisData(data)
    setActiveTab("preview")
    showSuccess("Data Uploaded", "Your data has been successfully analyzed and is ready for preview.")
  }

  const handleAnalysisComplete = (updatedData: AnalysisData) => {
    logger.info("Advanced analysis completed", {
      correlations: updatedData.mlAnalysis?.correlations?.length || 0,
      trends: updatedData.mlAnalysis?.trends?.length || 0,
      clusters: updatedData.mlAnalysis?.clusters?.length || 0,
    })

    setAnalysisData(updatedData)
    setActiveTab("analysis")
    showSuccess("Analysis Complete", "Advanced machine learning analysis has been completed.")
  }

  const handleError = (error: string, context?: string) => {
    logger.error("Application error occurred", { context, error })
    showError("Error Occurred", error, {
      label: "Retry",
      onClick: () => window.location.reload(),
    })
  }

  const handleTabChange = (value: string) => {
    logger.debug("Tab changed", { from: activeTab, to: value })
    setActiveTab(value)

    if (value === "analysis" && !analysisData?.mlAnalysis) {
      showInfo("Analysis Required", "Please run advanced analysis from the Preview tab first.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Upload Data
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                disabled={!analysisData}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                disabled={!analysisData}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Analysis
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                disabled={!analysisData}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6 animate-fade-in">
              <FileUpload
                onDataAnalyzed={handleDataAnalyzed}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onError={handleError}
                setLoadingStage={setLoadingStage}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 animate-fade-in">
              {analysisData && (
                <DataPreview
                  data={analysisData}
                  onAnalysisComplete={handleAnalysisComplete}
                  onError={handleError} // Pass onError
                  setLoadingStage={setLoadingStage} // Pass setLoadingStage
                />
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6 animate-fade-in">
              {analysisData && <AnalysisResults data={analysisData} />}
            </TabsContent>

            <TabsContent value="reports" className="space-y-6 animate-fade-in">
              {analysisData && (
                <ReportGenerator
                  data={analysisData}
                  onError={handleError} // Pass onError
                  setLoadingStage={setLoadingStage} // Pass setLoadingStage
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {isLoading && (
          <EnhancedLoading
            message="Processing your data with advanced algorithms..."
            stage={loadingStage}
            showProgress={false}
          />
        )}
      </main>

      <ToastContainer />
    </div>
  )
}

export default function Home() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}
