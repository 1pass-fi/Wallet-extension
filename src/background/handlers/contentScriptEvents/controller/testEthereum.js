export default async (_, tab, next) => {
  try {
    setTimeout(() => {
      next({ data: 'HELLO FROM BACKGROUND' })
    }, 3000)
  } catch (err) {
    console.error(err.message)
    next({ error: 'TEST ETHEREUM ERROR' })
  }
}
