import { logger } from "./logger"

export interface RetryOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

export class RetryableError extends Error {
  constructor(
    message: string,
    public isRetryable = true,
  ) {
    super(message)
    this.name = "RetryableError"
  }
}

export class QuotaExceededError extends RetryableError {
  constructor(message: string) {
    super(message, false) // Quota errors are not retryable
    this.name = "QuotaExceededError"
  }
}

export async function withRetry<T>(operation: () => Promise<T>, options: RetryOptions, context: string): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      logger.debug(`Attempting operation: ${context}`, { attempt, maxRetries: options.maxRetries })

      const result = await operation()

      if (attempt > 0) {
        logger.info(`Operation succeeded after ${attempt} retries: ${context}`)
      }

      return result
    } catch (error) {
      lastError = error as Error

      const errorMessage = lastError.message.toLowerCase()
      const isQuotaError =
        errorMessage.includes("quota") ||
        errorMessage.includes("billing") ||
        errorMessage.includes("exceeded") ||
        errorMessage.includes("insufficient") ||
        errorMessage.includes("payment")

      if (isQuotaError) {
        logger.warn(`Quota/billing error detected, stopping retries: ${context}`, {
          attempt: attempt + 1,
          errorMessage: lastError.message,
        })
        throw new QuotaExceededError(lastError.message) // Throw specific error
      }

      logger.warn(`Operation failed on attempt ${attempt + 1}: ${context}`, {
        attempt: attempt + 1,
        maxRetries: options.maxRetries,
        errorMessage: lastError.message,
      })

      // Don't retry on the last attempt or if explicitly non-retryable
      if (attempt === options.maxRetries || (error instanceof RetryableError && !error.isRetryable)) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(options.baseDelay * Math.pow(options.backoffFactor, attempt), options.maxDelay)

      logger.debug(`Waiting ${delay}ms before retry: ${context}`, { delay })
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // Only log as error if all retries failed for a retryable error
  if (lastError && !(lastError instanceof RetryableError && !lastError.isRetryable)) {
    logger.error(
      `Operation failed after all retries: ${context}`,
      {
        totalAttempts: options.maxRetries + 1,
      },
      lastError,
    )
  }

  throw lastError // Re-throw the last error
}
