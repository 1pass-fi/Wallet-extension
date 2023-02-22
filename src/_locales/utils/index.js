export default async function getFetchWithTimeout(url, opts, timeout = 5000) {
  const abortController = new window.AbortController()
  const { signal } = abortController
  const f = window.fetch(url, {
    ...opts,
    signal
  })

  const timer = setTimeout(() => abortController.abort(), timeout)

  try {
    const res = await f
    clearTimeout(timer)
    return res
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}
