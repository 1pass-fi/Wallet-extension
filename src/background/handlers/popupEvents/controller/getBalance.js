import helpers from 'background/helpers'

export default (payload, next) => {
  helpers.loadBalances()
  next()
}
