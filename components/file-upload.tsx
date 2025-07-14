"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertCircle, Zap, CheckCircle, Database, BarChart3, Brain, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { parseCSV } from "@/lib/csv-parser"
import { generateInitialInsights } from "@/lib/ai-insights"
import { config } from "@/lib/config"
import { logger } from "@/lib/logger"
import type { AnalysisData } from "@/app/page"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/error-toast" // Import useToast

interface FileUploadProps {
  onDataAnalyzed: (data: AnalysisData) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  onError: (error: string, context?: string) => void
  setLoadingStage: (stage: string) => void
}

export function FileUpload({ onDataAnalyzed, isLoading, setIsLoading, onError, setLoadingStage }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStage, setProcessingStage] = useState("")
  const { showSuccess, showError, showApiQuotaWarning } = useToast() // Use the toast hook

  const validateFile = (file: File): string | null => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return "Please upload a CSV file"
    }

    if (file.size > config.app.maxFileSize) {
      return `File size exceeds ${config.app.maxFileSize / 1024 / 1024}MB limit`
    }

    return null
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      logger.info("File upload initiated", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        onError(validationError, "file-validation")
        return
      }

      setError(null)
      setIsLoading(true)
      setUploadProgress(0)

      try {
        // Stage 1: Reading file
        setProcessingStage("Reading file...")
        setLoadingStage("Reading and parsing CSV file...")
        setUploadProgress(20)

        const text = await file.text()
        logger.debug("File read successfully", { textLength: text.length })

        // Stage 2: Parsing CSV
        setProcessingStage("Parsing CSV data...")
        setLoadingStage("Analyzing data structure...")
        setUploadProgress(40)

        const parsedData = parseCSV(text)
        logger.info("CSV parsed successfully", {
          rows: parsedData.summary.totalRows,
          columns: parsedData.summary.totalColumns,
          numericColumns: parsedData.summary.numericColumns.length,
          categoricalColumns: parsedData.summary.categoricalColumns.length,
        })

        if (parsedData.data.length === 0) {
          throw new Error("No data found in the CSV file")
        }

        if (parsedData.data.length > config.app.maxRows) {
          logger.warn("Large dataset detected, sampling data", {
            originalRows: parsedData.data.length,
            sampledRows: config.app.sampleSize,
          })

          parsedData.data = parsedData.data.slice(0, config.app.sampleSize)
          parsedData.summary.totalRows = parsedData.data.length
        }

        // Stage 3: Generating insights
        setProcessingStage("Generating AI insights...")
        setLoadingStage("Analyzing patterns with AI...")
        setUploadProgress(70)

        const insights = await generateInitialInsights(parsedData)
        logger.info("Initial insights generated", { insightsLength: insights.length })

        // Check if fallback was used for AI insights
        if (insights.includes("ADVANCED DATA ANALYSIS REPORT")) {
          showApiQuotaWarning()
        }

        // Stage 4: Finalizing
        setProcessingStage("Finalizing analysis...")
        setLoadingStage("Preparing results...")
        setUploadProgress(90)

        const analysisData: AnalysisData = {
          ...parsedData,
          insights,
        }

        setUploadProgress(100)
        setTimeout(() => {
          onDataAnalyzed(analysisData)
          logger.info("Data analysis completed successfully")
        }, 500)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to process file"
        logger.error("File processing failed", { error: errorMessage }, err as Error)
        setError(errorMessage)
        onError(errorMessage, "file-processing")
        showError("File Processing Error", errorMessage) // Show error toast
      } finally {
        setTimeout(() => {
          setIsLoading(false)
          setUploadProgress(0)
          setProcessingStage("")
          setLoadingStage("")
        }, 1000)
      }
    },
    [onDataAnalyzed, setIsLoading, onError, setLoadingStage, showError, showApiQuotaWarning],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    disabled: isLoading,
  })

  return (
    <div className="space-y-6">
      {/* Enhanced Status Alert */}
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <Zap className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <strong>Advanced Analytics Ready:</strong> AI-powered analysis with intelligent fallback systems
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Fallback Analytics Active
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  <Info className="w-3 h-3 mr-1" />
                  Professional Insights Guaranteed
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Secure</span>
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Fast</span>
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Reliable</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Enhanced Upload Card */}
      <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload CSV Data</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Upload your CSV file to begin advanced data analysis with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-blue-400 bg-blue-50 scale-105"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>

              {isDragActive ? (
                <div className="space-y-2">
                  <p className="text-blue-600 font-medium">Drop the CSV file here...</p>
                  <p className="text-sm text-blue-500">Release to upload</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-700 font-medium">Drag and drop a CSV file here</p>
                  <p className="text-sm text-gray-500">or click to select from your computer</p>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isLoading ? "Processing..." : "Select File"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Processing Progress */}
          {isLoading && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{processingStage}</span>
                <span className="text-blue-600 font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mt-4 animate-slide-up">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Upload Error</p>
                  <p>{error}</p>
                  <div className="text-xs text-red-600 mt-2">
                    <p>Troubleshooting tips:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Ensure file is in CSV format</li>
                      <li>Check file size is under {config.app.maxFileSize / 1024 / 1024}MB</li>
                      <li>Verify CSV has proper headers</li>
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Features Grid */}
      <Card className="card-hover border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Analytics Features
          </CardTitle>
          <CardDescription>
            Comprehensive data analysis powered by machine learning and artificial intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Advanced pattern recognition with intelligent fallback",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: BarChart3,
                title: "Machine Learning Analysis",
                description: "Automated correlation, clustering, and trend detection",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Database,
                title: "Smart Data Processing",
                description: "Efficient parsing with quality validation",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Zap,
                title: "Real-time Analytics",
                description: "Instant insights with progress tracking",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: CheckCircle,
                title: "Robust Error Handling",
                description: "Comprehensive retry mechanisms and fallbacks",
                color: "from-teal-500 to-blue-500",
              },
              {
                icon: Upload,
                title: "Secure File Processing",
                description: "Client-side processing with data validation",
                color: "from-indigo-500 to-purple-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
