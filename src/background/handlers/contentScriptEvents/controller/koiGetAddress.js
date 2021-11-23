export default async (_, tab, next) => {
  const { activatedAddress, hadPermission } = tab
  try {
    if (!hadPermission) {
      next({ data: { status: 401, data: 'Do not have permissions.' } })
      return
    }

    if (activatedAddress) {
      next({ data: { status: 200, data: activatedAddress } })
    } else {
      next({ data: { status: 404, data: 'Address not found.' } })
    }
  } catch (err) {
    console.error(err.message)
    next({ data: { status: 500, data: 'Get address error' } })
  }
}
