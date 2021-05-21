import { action } from '@storybook/addon-actions'

/* Partial event logging, as full logging can be expensive/slow
 * Invocation: partialLog('actionName')(eventObj, ...args)
 */
export default (actionName) => {
  const beacon = action(actionName)
  return (eventObj, ...args) => {
    beacon({ ...eventObj, view: undefined }, ...args)
  }
}
