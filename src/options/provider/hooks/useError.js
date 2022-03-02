import { useEffect, useState } from 'react'

export default () => {
  const [error, setError] = useState(null)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const _setError = (message) => {
    setError(null)
    setError(message)
  }

  return [error, _setError]
}
