// Secure configuration management
export const config = {
  openai: {
    apiKey:
      process.env.OPENAI_API_KEY ||
      "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",
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    timeout: 30000, // 30 seconds
  },
  app: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxRows: 50000,
    sampleSize: 1000,
  },
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey && apiKey.startsWith("sk-") && apiKey.length > 20
}
