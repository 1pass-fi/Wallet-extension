import { Generic } from './generic'
import { Setting } from './settings'

class Storage {
  constructor() {
    this.generic = new Generic()
    this.setting = new Setting()
  }
}

export default new Storage()
