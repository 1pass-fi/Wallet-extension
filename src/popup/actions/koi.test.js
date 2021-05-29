import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
require('text-encoding').TextDecoder

import backgroundConnect from 'actions/backgroundConnect'
import {
  SET_LOADING,
  SET_KOI,
  SET_ERROR,
  SET_ASSETS,
  SET_CREATE_WALLET,
  SET_CONT_LOADING,
  SET_TRANSACTIONS,
  SET_NOTIFICATION
} from 'actions/types'

import {
  importWallet,
  loadWallet,
  removeWallet,
  unlockWallet,
  generateWallet,
  saveWallet,
  loadContent,
  makeTransfer,
  lockWallet
} from './koi'

import { MESSAGES } from 'koiConstants'

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
            koiData: {
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
            koiData: {
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
    let history, inputData
    beforeEach(() => {
      store = mockStore()

      const push = jest.fn()
      history = { push }

      inputData = { history }

      let dispatch = store.dispatch
      removeWallet(inputData)(dispatch)
    })

    describe('background removeWallet success', () => {
      beforeEach(() => {
        let removeSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.REMOVE_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {
            koiData: {
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
            type: SET_ASSETS,
            payload: []
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
        store.dispatch(removeWallet(inputData))
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
        store.dispatch(removeWallet(inputData))
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
        store.dispatch(removeWallet(inputData))
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
            koiData: {
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


  // describe('Tests for generateWallet()', () => {
  //   let inputData, history

  //   beforeEach(() => {
  //     store = mockStore()

  //     const push = jest.fn()
  //     history = { push }

  //     inputData = {
  //       password: 'password',
  //       stage: 'stage'
  //     }

  //     let dispatch = store.dispatch
  //     generateWallet(inputData)(dispatch)
  //   })

  //   describe('background unlockWallet success', () => {
  //     beforeEach(() => {
  //       let generateSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
  //         return handler.type = MESSAGES.GENERATE_WALLET_SUCCESS
  //       })[0].callback

  //       const response = {
  //         data: {
  //           seedPhrase: 'seedPhrase'
  //         }
  //       }

  //       backgroundConnect.postMessage = () => {
  //         generateSuccessFunction(response)
  //       }

  //       expectedActions = [
  //         {
  //           type: SET_LOADING,
  //           payload: true
  //         },
  //         {
  //           type: SET_LOADING,
  //           payload: true
  //         },
  //         {
  //           type: SET_CREATE_WALLET,
  //           payload: {
  //             seedPhrase: 'seedPhrase',
  //             stage: inputData.stage,
  //             password: inputData.password
  //           }
  //         },
  //         {
  //           type: SET_LOADING,
  //           payload: false
  //         }
  //       ]
  //     })

  //     it('dispatchs data as expected', async () => {
  //       store.dispatch(generateWallet(inputData))
  //       expect(store.getActions()).toEqual(expectedActions)
  //     })
  //   })

  //   describe('background generateWallet failed', () => {
  //     beforeEach(() => {
  //       let generateFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
  //         return handler.type === MESSAGES.ERROR
  //       })[0].callback

  //       const response = {
  //         data: 'Error message'
  //       }

  //       backgroundConnect.postMessage = () => {
  //         generateFailedFunction(response)
  //       }

  //       expectedActions = [
  //         { type: SET_LOADING, payload: true },
  //         { type: SET_LOADING, payload: true },
  //         { type: SET_LOADING, payload: false },
  //         { type: SET_ERROR, payload: 'Error message' }
  //       ]
  //     })

  //     it('dispatchs data as expected', () => {
  //       store.dispatch(generateWallet(inputData))
  //       expect(store.getActions()).toEqual(expectedActions)
  //     })
  //   })


  //   describe('something went wrong', () => {
  //     beforeEach(() => {
  //       backgroundConnect.postMessage = () => {
  //         throw new Error('Error message')
  //       }

  //       expectedActions = [
  //         { type: SET_LOADING, payload: true },
  //         { type: SET_LOADING, payload: true },
  //         { type: SET_ERROR, payload: 'Error message' },
  //         { type: SET_LOADING, payload: false },
  //       ]
  //     })

  //     it('dispatchs data as expected', () => {
  //       store.dispatch(generateWallet(inputData))
  //       expect(store.getActions()).toEqual(expectedActions)
  //     })
  //   })
  // })

  describe('Tests for saveWallet()', () => {
    let inputData, history

    beforeEach(() => {
      store = mockStore()

      const push = jest.fn()
      history = { push }

      inputData = {
        history
      }

      let dispatch = store.dispatch
      saveWallet(inputData)(dispatch)
    })

    describe('background unlockWallet success', () => {
      beforeEach(() => {
        let saveSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type = MESSAGES.SAVE_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {
            koiData: 'koiData'
          }
        }

        backgroundConnect.postMessage = () => {
          saveSuccessFunction(response)
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
            payload: 'koiData'
          },
          {
            type: SET_LOADING,
            payload: false
          }
        ]
      })

      it('dispatchs data as expected', async () => {
        store.dispatch(saveWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background saveWallet failed', () => {
      beforeEach(() => {
        let saveFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.ERROR
        })[0].callback

        const response = {
          data: 'Error message'
        }

        backgroundConnect.postMessage = () => {
          saveFailedFunction(response)
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(saveWallet(inputData))
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
        store.dispatch(saveWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })


  describe('Tests for loadContent()', () => {
    let inputData, history

    beforeEach(() => {
      store = mockStore()

      const push = jest.fn()
      history = { push }

      let dispatch = store.dispatch
      loadContent()(dispatch)
    })

    describe('background loadContent success', () => {
      beforeEach(() => {
        let loadSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type = MESSAGES.LOAD_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {
            contentList: 'contentList'
          }
        }

        backgroundConnect.postMessage = () => {
          loadSuccessFunction(response)
        }

        expectedActions = [
          {
            type: SET_CONT_LOADING,
            payload: true
          },
          {
            type: SET_CONT_LOADING,
            payload: true
          },
          {
            type: SET_ASSETS,
            payload: 'contentList'
          },
          {
            type: SET_CONT_LOADING,
            payload: false
          }
        ]
      })

      it('dispatchs data as expected', async () => {
        store.dispatch(loadContent(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background generateWallet failed', () => {
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
          { type: SET_CONT_LOADING, payload: true },
          { type: SET_CONT_LOADING, payload: true },
          { type: SET_CONT_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(loadContent(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })


    describe('something went wrong', () => {
      beforeEach(() => {
        backgroundConnect.postMessage = () => {
          throw new Error('Error message')
        }

        expectedActions = [
          { type: SET_CONT_LOADING, payload: true },
          { type: SET_CONT_LOADING, payload: true },
          { type: SET_ERROR, payload: 'Error message' },
          { type: SET_CONT_LOADING, payload: false },
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(loadContent(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })


  describe('Tests for makeTransfer()', () => {
    let inputData, history

    beforeEach(() => {
      store = mockStore()

      const push = jest.fn()
      history = { push }

      const inputData = 'inputData'

      let dispatch = store.dispatch
      makeTransfer(inputData)(dispatch)
    })

    describe('background makeTransfer success', () => {
      beforeEach(() => {
        let transferSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type = MESSAGES.MAKE_TRANSFER_SUCCESS
        })[0].callback

        const response = {
          data: {
            txId: 'txId'
          }
        }

        backgroundConnect.postMessage = () => {
          transferSuccessFunction(response)
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
            type: SET_TRANSACTIONS,
            payload: 'txId'
          },
          {
            type: SET_LOADING,
            payload: false
          },
          {
            type: SET_NOTIFICATION,
            payload: 'Transaction sent.'
          }
        ]
      })

      it('dispatchs data as expected', async () => {
        store.dispatch(makeTransfer(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background generateWallet failed', () => {
      beforeEach(() => {
        let transferFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.ERROR
        })[0].callback

        const response = {
          data: 'Error message'
        }

        backgroundConnect.postMessage = () => {
          transferFailedFunction(response)
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(makeTransfer(inputData))
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
        store.dispatch(makeTransfer(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })


  describe('Tests for lockWallet()', () => {
    let inputData, history

    beforeEach(() => {
      store = mockStore()

      const push = jest.fn()
      history = { push }

      inputData = { history }

      let dispatch = store.dispatch
      lockWallet(inputData)(dispatch)
    })

    describe('background lockWallet success', () => {
      beforeEach(() => {
        let lockSuccessFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type = MESSAGES.LOCK_WALLET_SUCCESS
        })[0].callback

        const response = {
          data: {}
        }

        backgroundConnect.postMessage = () => {
          lockSuccessFunction(response)
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
              koiBalance: null,
              arBalance: null,
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
        store.dispatch(lockWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('background generateWallet failed', () => {
      beforeEach(() => {
        let lockFailedFunction = backgroundConnect.eventHandlers.filter((handler) => {
          return handler.type === MESSAGES.ERROR
        })[0].callback

        const response = {
          data: 'Error message'
        }

        backgroundConnect.postMessage = () => {
          lockFailedFunction(response)
        }

        expectedActions = [
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: true },
          { type: SET_LOADING, payload: false },
          { type: SET_ERROR, payload: 'Error message' }
        ]
      })

      it('dispatchs data as expected', () => {
        store.dispatch(lockWallet(inputData))
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
        store.dispatch(lockWallet(inputData))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
