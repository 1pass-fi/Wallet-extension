import { MESSAGES } from 'constants/koiConstants'

const declareConstantScript = `() => {
  window.ENDPOINTS = JSON.parse('${JSON.stringify(MESSAGES)}')
}`

export default declareConstantScript
