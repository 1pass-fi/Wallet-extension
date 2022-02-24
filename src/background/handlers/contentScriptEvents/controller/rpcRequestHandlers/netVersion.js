export default (payload, tab, next) => {
  try {
    const mockedNetworkId = '4'
    next({ data: { responseData: mockedNetworkId, id: payload.data.id } })
  } catch (err) {
    next({ error: err.message })
  }
}
