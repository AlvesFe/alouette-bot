export interface ErrorFactory {
  message: string
  error: Error | unknown
  data?: Record<string, unknown>
}