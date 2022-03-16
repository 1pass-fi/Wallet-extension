export default (payload, tab, next) => {
  try {
    console.log('=== TEST SEND ETH TRANSACTION ===')
    // TODO: ThuanN

    next({data: 'mocked_sendTransaction'})
  } catch (err) {
    next({ error: err.message })
  }
}
