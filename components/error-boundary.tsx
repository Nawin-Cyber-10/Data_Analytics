"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Bug } from "lucide-react"
import { logger } from "@/lib/logger"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(
      "React Error Boundary caught an error",
      {
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack,
      },
      error,
    )

    this.setState({ error, errorInfo })
  }

  handleRetry = () => {
    logger.info("User initiated error boundary retry")
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Application Error</CardTitle>
              <CardDescription className="text-red-600">
                Something went wrong while processing your request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {this.state.error?.message || "Unknown error occurred"}
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">What you can do:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Try refreshing the page or clicking retry below</li>
                  <li>• Check your internet connection</li>
                  <li>• Ensure your CSV file is properly formatted</li>
                  <li>• Try with a smaller dataset if the file is very large</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={this.handleRetry} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Technical Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
