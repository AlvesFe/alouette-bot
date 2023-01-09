import { ErrorFactory } from '../types/error'
import * as fs from 'fs'

const errorMetric = ({
  message,
  error,
  data
}: ErrorFactory): void => {
  const timestamp = new Date().toISOString()
  const payload = {
    timestamp,
    message,
    error,
    data
  }
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
  }
  fs.writeFileSync(
    `./logs/error-${timestamp}.json`,
    JSON.stringify(payload, null, 2)
  )
  console.error(payload)
}

export default errorMetric
