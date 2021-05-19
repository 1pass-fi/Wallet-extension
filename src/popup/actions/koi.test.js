import '@babel/polyfill'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import backgroundConnect from 'actions/backgroundConnect'
import { SET_LOADING, SET_KOI, SET_ERROR } from 'actions/types'
import { MESSAGES } from 'constants'
import { importWallet, loadWallet, removeWallet, unlockWallet } from './koi'

describe('Tests for actions/koi', () => {
  let middlewares, mockStore, store, expectedActions, postMessage

  beforeAll(() => {
    middlewares = [thunk]
    mockStore = configureMockStore(middlewares)
  })

  afterAll(() => {

  })

  beforeEach(() => {
    postMessage = backgroundConnect.postMessage
  })

  afterEach(() => {
    backgroundConnect.postMessage = postMessage
    backgroundConnect.eventHandlers = []
  })

  describe('Tests for importWallet()', () => {
    let inputData, history

    beforeEach(() => {
      store = mockStore()

      const push = jest.fn()
      history = { push }

      inputData = {
        data: 'data',
        password: 'password',
        history,
        redirectPath: 'redirectPath'
      }

      let dispatch = store.dispatch
      importWallet(inputData)(dispatch)

    })

    describe('background importWallet success', () => {
      beforeEach(() => {
        let importSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type = MESSAGES.IMPORT_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {
            koiData : {
              arBalance: 100,
              koiBalance: 200,
              address: 'address'
            }
          }
        }

        backgroundConnect.postMessage = () => {
          importSuccessFunction(response)
        }

        expectedActions = [
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_KOI,
            payload: {
              arBalance: 100,
              koiBalance: 200,
              address: 'address'
            }
          },
          {
            type: SET_LOADING,
            payload: false
          }
        ]
      })

      it('dispatchs data as expected', async () => {  
        store.dispatch(importWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background importWallet failed', () => {
      beforeEach(() => {
        let importFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.ERROR
        })[0].callback

        const response = {
          data: 'Error message'
        }

        backgroundConnect.postMessage = () => {
          importFailedFunction(response)
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(importWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })


    describe('something went wrong', () => {
      beforeEach(() => {
        backgroundConnect.postMessage = () => {
          throw new Error('Error message')
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_ERROR, payload: 'Error message' },
          { type: SET_LOADING, payload: false },
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(importWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('Tests for loadWallet()', () => {
    let inputData

    beforeEach(() => {
      store = mockStore()

      inputData = {
        data: 'data',
      }

      let dispatch = store.dispatch
      loadWallet(inputData)(dispatch)

    })

    describe('background loadWallet success', () => {
      beforeEach(() => {
        let loadSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type = MESSAGES.LOAD_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {
            koiData : {
              arBalance: 100,
              koiBalance: 200,
              address: 'address'
            }
          }
        }

        backgroundConnect.postMessage = () => {
          loadSuccessFunction(response)
        }

        expectedActions = [
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_KOI,
            payload: {
              arBalance: 100,
              koiBalance: 200,
              address: 'address'
            }
          },
          {
            type: SET_LOADING,
            payload: false
          }
        ]
      })

      it('dispatchs data as expected', async () => {  
        store.dispatch(loadWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background loadWallet failed', () => {
      beforeEach(() => {
        let loadFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.ERROR
        })[0].callback

        const response = {
          data: 'Error message'
        }

        backgroundConnect.postMessage = () => {
          loadFailedFunction(response)
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(loadWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })


    describe('something went wrong', () => {
      beforeEach(() => {
        backgroundConnect.postMessage = () => {
          throw new Error('Error message')
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_ERROR, payload: 'Error message' },
          { type: SET_LOADING, payload: false },
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(loadWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('Tests for removeWallet()', () => {
    beforeEach(() => {
      store = mockStore()

      let dispatch = store.dispatch
      removeWallet()(dispatch)
    })

    describe('background removeWallet success', () => {
      beforeEach(() => {
        let removeSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.REMOVE_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {
            koiData : {
              arBalance: null,
              koiBalance: null,
              address: null
            }
          }
        }

        backgroundConnect.postMessage = () => {
          removeSuccessFunction(response)
        }

        expectedActions = [
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_KOI,
            payload: {
              arBalance: null,
              koiBalance: null,
              address: null
            }
          },
          {
            type: SET_LOADING,
            payload: false
          }
        ]
      })

      it('dispatchs data as expected', async () => {  
        store.dispatch(removeWallet())
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background removeWallet failed', () => {
      beforeEach(() => {
        let removeFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.ERROR
        })[0].callback

        const response = {
          data: 'Error message'
        }

        backgroundConnect.postMessage = () => {
          removeFailedFunction(response)
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(removeWallet())
        expect(store.getActions()).toEqual(expectedActions)
      })
    })


    describe('something went wrong', () => {
      beforeEach(() => {
        backgroundConnect.postMessage = () => {
          throw new Error('Error message')
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_ERROR, payload: 'Error message' },
          { type: SET_LOADING, payload: false },
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(removeWallet())
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('Tests for unlockWallet()', () => {
    let inputData, history

    beforeEach(() => {
      store = mockStore()

      const push = jest.fn()
      history = { push }

      inputData = {
        password: 'password',
        history,
        redirectPath: 'redirectPath'
      }

      let dispatch = store.dispatch
      unlockWallet(inputData)(dispatch)
    })

    describe('background unlockWallet success', () => {
      beforeEach(() => {
        let unlockSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type = MESSAGES.UNLOCK_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {
            koiData : {
              arBalance: 100,
              koiBalance: 200,
              address: 'address'
            }
          }
        }

        backgroundConnect.postMessage = () => {
          unlockSuccessFunction(response)
        }

        expectedActions = [
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_LOADING,
            payload: true
          },
          {
            type: SET_KOI,
            payload: {
              arBalance: 100,
              koiBalance: 200,
              address: 'address'
            }
          },
          {
            type: SET_LOADING,
            payload: false
          }
        ]
      })

      it('dispatchs data as expected', async () => {  
        store.dispatch(unlockWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background unlockWallet failed', () => {
      beforeEach(() => {
        let importFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.ERROR
        })[0].callback

        const response = {
          data: 'Error message'
        }

        backgroundConnect.postMessage = () => {
          importFailedFunction(response)
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(unlockWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })


    describe('something went wrong', () => {
      beforeEach(() => {
        backgroundConnect.postMessage = () => {
          throw new Error('Error message')
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_ERROR, payload: 'Error message' },
          { type: SET_LOADING, payload: false },
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(unlockWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
