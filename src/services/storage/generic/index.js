import { GenericGet } from './get'
import { GenericSet } from './set'
import { GenericRemove } from './remove'
import { GenericMethod } from './method'

export class Generic {
  constructor() {
    this.get = new GenericGet()
    this.set = new GenericSet()
    this.remove = new GenericRemove()
    this.method = new GenericMethod()
  }
}
