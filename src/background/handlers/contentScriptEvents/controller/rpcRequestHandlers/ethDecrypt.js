export default (payload, tab, next) => {
  try {
    const mockedDecryptedData = 'DecryptedData'
    next({ data: { responseData: mockedDecryptedData, id: payload.data.id } })
  } catch (err) {
    next({ error: err.message })
  }
}
