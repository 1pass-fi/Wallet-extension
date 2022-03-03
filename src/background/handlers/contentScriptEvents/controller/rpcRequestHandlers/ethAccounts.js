export default (payload, tab, next) => {
  try {
    const { hadPermission, activatedAddress } = tab

    let responseAddress = []
    if (hadPermission) {
      responseAddress = [activatedAddress]
    }

    next({ data: responseAddress })
  } catch (err) {
    next({ error: err.message })
  }
}
