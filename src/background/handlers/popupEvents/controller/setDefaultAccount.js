// Services
import storage from 'services/storage'


export default async (payload, next) => {
  try {
    const { address } = payload.data
    await storage.setting.set.activatedAccountAddress(address)

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
