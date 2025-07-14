"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center space-x-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <div>
              <p className="font-medium">Processing your data...</p>
              <p className="text-sm text-gray-600">This may take a few moments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
