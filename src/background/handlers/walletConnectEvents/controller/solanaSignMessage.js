export default async (payload, metadata, next) => {
  try {
    console.log('solana sign message')
    console.log('payload', payload)

    
    next({
      data: {
        signature:
          '2Lb1KQHWfbV3pWMqXZveFWqneSyhH95YsgCENRWnArSkLydjN1M42oB82zSd6BBdGkM9pE6sQLQf1gyBh8KWM2c4'
      }
    })
  } catch (error) {
    next({ error: { code: 4001, message: error.message } })
  }
}
