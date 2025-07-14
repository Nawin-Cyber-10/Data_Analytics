export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      error,
    }

    this.logs.push(logEntry)

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output with appropriate level
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : ""
    const errorStr = error ? ` | Error: ${error.message}` : ""
    const fullMessage = `[${this.formatTimestamp()}] ${message}${contextStr}${errorStr}`

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage)
        break
      case LogLevel.INFO:
        console.info(fullMessage)
        break
      case LogLevel.WARN:
        console.warn(fullMessage)
        break
      case LogLevel.ERROR:
        console.error(fullMessage)
        break
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.addLog(LogLevel.WARN, message, context)
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.addLog(LogLevel.ERROR, message, context, error)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()
