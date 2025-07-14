"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"

export interface ToastMessage {
  id: string
  type: "error" | "warning" | "info" | "success"
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

interface ErrorToastProps {
  message: ToastMessage
  onDismiss: (id: string) => void
}

const toastIcons = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
}

const toastStyles = {
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-orange-200 bg-orange-50 text-orange-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-green-200 bg-green-50 text-green-800",
}

export function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = toastIcons[message.type]

  useEffect(() => {
    if (message.duration && message.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, message.duration)
      return () => clearTimeout(timer)
    }
  }, [message.duration])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(message.id), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={`transform transition-all duration-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <Alert className={`${toastStyles[message.type]} border shadow-lg`}>
        <Icon className="h-4 w-4" />
        <div className="flex-1">
          <AlertDescription>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{message.title}</p>
                <p className="text-sm mt-1">{message.message}</p>
                {message.action && (
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={message.action.onClick}>
                    {message.action.label}
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </div>
      </Alert>
    </div>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showError = (title: string, message: string, action?: ToastMessage["action"]) => {
    addToast({ type: "error", title, message, action, duration: 8000 })
  }

  const showWarning = (title: string, message: string, action?: ToastMessage["action"]) => {
    addToast({ type: "warning", title, message, action, duration: 6000 })
  }

  const showInfo = (title: string, message: string, action?: ToastMessage["action"]) => {
    addToast({ type: "info", title, message, action, duration: 4000 })
  }

  const showSuccess = (title: string, message: string, action?: ToastMessage["action"]) => {
    addToast({ type: "success", title, message, action, duration: 4000 })
  }

  const showApiQuotaWarning = () => {
    addToast({
      type: "warning",
      title: "AI Service Temporarily Unavailable",
      message: "Using advanced fallback analytics to ensure you still receive comprehensive insights.",
      duration: 6000,
    })
  }

  return {
    toasts,
    removeToast,
    showError,
    showWarning,
    showInfo,
    showSuccess,
    showApiQuotaWarning,
  }
}

// Toast Container Component
export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ErrorToast key={toast.id} message={toast} onDismiss={removeToast} />
      ))}
    </div>
  )
}
