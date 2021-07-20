import { SettingGet } from './get'
import { SettingSet } from './set'
import { SettingRemove } from './remove'
import { SettingMethod } from './method'

export class Setting {
  constructor() {
    this.get = new SettingGet()
    this.set = new SettingSet()
    this.remove = new SettingRemove()
    this.method = new SettingMethod()
  }
}
