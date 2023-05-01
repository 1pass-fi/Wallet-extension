import { SettingGet } from './get'
import { SettingMethod } from './method'
import { SettingRemove } from './remove'
import { SettingSet } from './set'
import update from './update'

export class Setting {
  constructor() {
    this.get = new SettingGet()
    this.set = new SettingSet()
    this.remove = new SettingRemove()
    this.method = new SettingMethod()
    this.update = update
  }
}
