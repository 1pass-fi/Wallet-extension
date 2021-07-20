import { ChromeStorage } from '../ChromeStorage'
import { SETTING } from '../storageConstants'


export class SettingMethod {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }
}
