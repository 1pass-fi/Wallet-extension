export default async (_, tab, next) => {
  const { hadPermission, activatedAddress } = tab
  try {
    next({ data: 'RESPONSE DATA -------' })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Get address error' })
  }
}
