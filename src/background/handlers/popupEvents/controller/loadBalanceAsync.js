import helpers from 'background/helpers'

export default async (_, next) => {
  await helpers.loadBalances()
  next()
}
