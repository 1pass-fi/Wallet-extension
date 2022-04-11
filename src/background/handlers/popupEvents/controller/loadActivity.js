// Services
import { backgroundAccount } from 'services/account'

// Constants
import helpers from 'background/helpers'


export default async (payload, next) => {
  try {
    const { network } = payload.data

    await helpers.loadActivities(network)
    next()
  } catch (err) {
    next({ error: err.message })
  }
}
