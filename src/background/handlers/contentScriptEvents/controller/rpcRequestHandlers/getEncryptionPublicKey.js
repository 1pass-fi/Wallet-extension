export default (payload, tab, next) => {
  try {
    const mockedEncryptionPublicKey = 'IAdeKH2mpDyIbxLFu5LNWUEKo/lkNTXOD90kjP8ceXM='
    next({ data: { responseData: mockedEncryptionPublicKey, id: payload.data.id } })
  } catch (err) {
    next({ error: err.message })
  }
}
