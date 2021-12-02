export default async (_, tab, next) => {
  const { hadPermission, activatedAddress } = tab
  try {
    if (hadPermission) {
      if (activatedAddress) {
        next({ data: activatedAddress })
      } else {
        next({ error: 'Address not found.' })
      }
    } else {
      next({ error: 'The site does not have the required permissions for this action.' })
    }
  } catch (err) {
    console.error(err.message)
    next({ error: 'Get address error' })
  }
}
