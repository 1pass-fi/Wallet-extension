import { EventHandler, BackgroundConnect } from './backgroundConnect'
import sinon  from 'sinon'

describe('Tests for backgroundConnect', () => {
  describe('Tests for EventHandler', () => {
    let eventHandler, fn, attr
    beforeEach(() => {
      fn = jest.fn()
      attr = {
        type: 'type',
        callback: fn
      }
      eventHandler = new EventHandler(attr.type, attr.callback)
    })

    it('Creates an instance with type and callback function', () => {
      expect(eventHandler.type).toEqual(attr.type)
      expect(eventHandler.callback).toEqual(attr.callback)
    })
  })

  describe('Tests for BackgroundConnect', () => {
    let backgroundConnect, connect, addListener
    
    beforeEach(() => {
      backgroundConnect = new BackgroundConnect('testPort')
    })

    it('Creates an instance with port testPort', () => {
      expect(backgroundConnect.eventHandlers).toEqual([])
    })

    it('adds new handler, remove Handler', () => {
      backgroundConnect.addHandler({ type: 'new handler' })
      expect(backgroundConnect.eventHandlers).toEqual([{ type: 'new handler' }])

      backgroundConnect.removeHandler('new handler')
      expect(backgroundConnect.eventHandlers).toEqual([])
    })
  })
})
