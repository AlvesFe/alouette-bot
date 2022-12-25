export default (toParse: string): URL | null => {
  try {
    return new URL(toParse)
  } catch {
    return null
  }
}