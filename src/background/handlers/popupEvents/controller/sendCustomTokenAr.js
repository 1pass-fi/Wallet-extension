export default async (payload, next) => {
  try {

  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
