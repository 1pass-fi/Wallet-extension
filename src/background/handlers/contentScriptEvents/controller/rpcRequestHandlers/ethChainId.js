export default (payload, tab, next) => {
  try {
    const mockedChainId = '0x4'
    next({ data: { responseData: mockedChainId, id: payload.data.id } })
  } catch (err) {
    next({ error: err.message })
  }
}
