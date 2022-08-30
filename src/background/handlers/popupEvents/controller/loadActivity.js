// Services
// Constants
import helpers from 'background/helpers'
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { network } = payload.data

    await helpers.loadActivities(network)
    next()
  } catch (err) {
    next({ error: err.message })
  }
}
