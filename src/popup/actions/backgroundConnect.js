import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { PORTS } from 'constants'

export const CreateEventHandler = EventHandler

export default new BackgroundConnect(PORTS.POPUP)
