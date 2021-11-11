export default (fn, errorMessage) => async (...args) => {
  try {
    return await fn(...args)
  } catch (err) {
    console.error(err.message)
    throw new Error(errorMessage || err.message)
  }
}
