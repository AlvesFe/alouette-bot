import { ErrorFactory } from '../types/error'
import * as fs from 'fs'
import path from 'path'

const errorMetric = ({
  message,
  error,
  data
}: ErrorFactory): void => {
  const timestamp = new Date()
  const payload = {
    timestamp: timestamp.toISOString(),
    message,
    error: String(error),
    data
  }

  const logsPath = path.join(__dirname, '../../logs')

  if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath)
  }

  const logFile = path.join(logsPath, `error-${timestamp.getTime()}.log`)
  fs.writeFileSync(logFile, JSON.stringify(payload, null, 2))
  console.error(payload)
}

export default errorMetric
