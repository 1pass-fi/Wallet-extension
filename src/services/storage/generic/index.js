import { GenericGet } from './get'
import { GenericMethod } from './method'
import { GenericRemove } from './remove'
import { GenericSet } from './set'

export class Generic {
  constructor() {
    this.get = new GenericGet()
    this.set = new GenericSet()
    this.remove = new GenericRemove()
    this.method = new GenericMethod()
  }
}
