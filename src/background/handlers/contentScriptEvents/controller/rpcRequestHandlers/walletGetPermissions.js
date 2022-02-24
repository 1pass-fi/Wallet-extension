export default (payload, tab, next) => {
  try {
    const mockedPermissions = [{
      caveats: [{
        type: 'restrictReturnedAccounts',
        value: ['0x9ffc78a6c4141235691e4585666b2646ea687b37']
      }],
      date: Date.now(),
      id: '??????',
      invoker: tab.origin,
      parentCapability: 'eth_accounts'
    }]
    next({ data: { responseData: mockedPermissions, id: payload.data.id } })
  } catch (err) {
    next({ error: err.message })
  }
}
