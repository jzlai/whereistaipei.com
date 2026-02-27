/**
 * Deduplicates an array of objects by comparing their JSON stringified values
 * @param items Array of items to deduplicate
 * @returns Deduplicated array
 */
export function deduplicate<T>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter(item => {
    const key = JSON.stringify(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}
