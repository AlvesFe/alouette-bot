import { ErrorFactory } from '../types/error';

const errorMetric = ({
  message,
  error,
  data
}: ErrorFactory): void => {
  console.error({
    message,
    error,
    data
  })
}

export default errorMetric
