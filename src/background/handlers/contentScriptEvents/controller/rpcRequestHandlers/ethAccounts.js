export default (payload, tab, next) => {
  try {
    const mockedAllAddresses = ['0x9ffC78a6C4141235691E4585666B2646Ea687B37']
    next({ data: { responseData: mockedAllAddresses, id: payload.data.id } })
  } catch (err) {
    next({ error: err.message })
  }
}
