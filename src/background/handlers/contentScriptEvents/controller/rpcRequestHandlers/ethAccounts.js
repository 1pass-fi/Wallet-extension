export default (payload, tab, next) => {
  try {
    const { connectedAddresses } = tab

    next({ data: connectedAddresses })
  } catch (err) {
    next({ error: err.message })
  }
}
