import ethereumRequestHandlers from 'background/handlers/contentScriptEvents/controller/rpcRequestHandlers'

export default async (payload, tab, next) => {
  try {
    console.log('request', payload.data.method)
    console.log('request - data', payload.data.params)
    ethereumRequestHandlers.send(payload.data.method, payload, tab, next)
  } catch (err) {
    console.error(err.message)
    next({ error: 'Ethereum request error' })
  }
}
