function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout | null

  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export const debouncedLog = debounce(
  (message: string) => console.log(message),
  200
)
