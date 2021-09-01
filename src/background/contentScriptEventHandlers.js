import { isString, isNumber, isEmpty } from 'lodash'

import { REQUEST, MESSAGES, STORAGE, OS, WINDOW_SIZE, PORTS } from 'constants/koiConstants'
import { checkSitePermission, setChromeStorage, removeChromeStorage, getChromeStorage, transfer } from 'utils'
import { getSelectedTab, createWindow } from 'utils/extension'
import signPort from 'utils/signPort'

import storage from 'services/storage'
import { backgroundAccount, popupAccount } from 'services/account'

let pendingMessages = {}

export default async (koi, port, message, ports, resolveId, sender) => {
  // console.log('PORT CONTENT SCRIPT', port)
  if (!message.type) return

  if (pendingMessages[message.type] === true) return
  pendingMessages[message.type] = true

  await popupAccount.loadImported()

  const getCurrentTab = () => {
    return new Promise((resolve, reject) => {
      getSelectedTab().then(tab => {
        try {
          const url = tab.url
          const origin = (new URL(url)).origin
          const favicon = tab.favIconUrl
          resolve({ origin, favicon, url })
        } catch (error) {
          reject(error)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }

  const checkCurrentTabPermission = async () => {
    const tab = await getCurrentTab()
    // console.log('CURRENT TAB', tab)
    const hadPermission = await storage.setting.method.checkSitePermission(tab.origin)
    return { ...tab, hadPermission }
  }

  const checkPendingRequest = async () => {
    const storage = await getChromeStorage(STORAGE.PENDING_REQUEST)
    if (storage[STORAGE.PENDING_REQUEST]) return true
    return false
  }

  const perform = async () => {
    try {
      const { origin, favicon, hadPermission } = await checkCurrentTabPermission()
      const hasPendingRequest = await checkPendingRequest()
      const allowedEndpoints = [
        MESSAGES.GET_PERMISSION,
        MESSAGES.CREATE_TRANSACTION,
        MESSAGES.CONNECT,
        MESSAGES.KOI_GET_PERMISSION,
        MESSAGES.KOI_CONNECT,
        MESSAGES.GET_ADDRESS,
        MESSAGES.DISCONNECT,
        MESSAGES.GET_PUBLIC_KEY,
        MESSAGES.GET_ALL_ADDRESSES,
        MESSAGES.GET_WALLET_NAMES
      ]
      if (!allowedEndpoints.includes(message.type)) {
        if (!hadPermission) {
          port.postMessage({
            type: `${message.type}_SUCCESS`,
            data: { status: 401, data: 'Do not have permissions.' },
            id: message.id
          })
          return
        }
      }

      switch (message.type) {
        case MESSAGES.GET_ADDRESS: {
          try {

            // get activated account address
            const activatedAddress = await storage.setting.get.activatedAccountAddress()
            const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
            const account = await backgroundAccount.getAccount(credentials)
            const address = await account.get.address()

            if (hadPermission) {
              if (address) {
                port.postMessage({
                  type: MESSAGES.GET_ADDRESS_SUCCESS,
                  data: address,
                  id: message.id
                })
              } else {
                port.postMessage({
                  type: MESSAGES.GET_ADDRESS_ERROR,
                  data: 'Address not found.',
                  id: message.id
                })
              }
            } else {
              port.postMessage({
                type: MESSAGES.GET_ADDRESS_ERROR,
                data: 'The site does not have the required permissions for this action.',
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_ADDRESS_ERROR,
              data: 'Something went wrong.',
              id: message.id
            })
          }
          break
        }

        case MESSAGES.KOI_GET_ADDRESS: {
          try {
            const siteAddressDictionary = await storage.setting.get.siteAddressDictionary()
            const activatedAddress = siteAddressDictionary[origin]

            if (activatedAddress) {
              port.postMessage({
                type: MESSAGES.KOI_GET_ADDRESS_SUCCESS,
                data: { status: 200, data: activatedAddress },
                id: message.id
              })
            } else {
              port.postMessage({
                type: MESSAGES.KOI_GET_ADDRESS_SUCCESS,
                data: { status: 404, data: 'Address not found.' },
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.KOI_GET_ADDRESS_SUCCESS,
              data: { status: 500, data: 'Something went wrong.' },
              id: message.id
            })
          }
          break
        }

        case MESSAGES.GET_ALL_ADDRESSES: {
          try {
            if (hadPermission) {
              if (koi.address) {
                port.postMessage({
                  type: MESSAGES.GET_ALL_ADDRESSES_SUCCESS,
                  data: [koi.address],
                  id: message.id
                })
              } else {
                port.postMessage({
                  type: MESSAGES.GET_ALL_ADDRESSES_ERROR,
                  data: 'The site does not have the required permissions for this action',
                  id: message.id
                })
              }
            } else {
              port.postMessage({
                type: MESSAGES.GET_ALL_ADDRESSES_ERROR,
                data: 'The site does not have the required permissions for this action',
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_ALL_ADDRESSES_ERROR,
              data: 'Something went wrong.',
              id: message.id
            })
          }
          break
        }

        case MESSAGES.GET_PERMISSION: {
          // console.log('GET_PERMISSION PORT', port)
          try {
            if (hadPermission) {
              port.postMessage({
                type: MESSAGES.GET_PERMISSION_SUCCESS,
                data: [
                  'SIGN_TRANSACTION', 
                  'ACCESS_ADDRESS', 
                  'ACCESS_PUBLIC_KEY',
                  'ACCESS_ALL_ADDRESSES',
                  'ENCRYPT',
                  'DECRYPT',
                  'SIGNATURE',
                  'ACCESS_ARWEAVE_CONFIG'
                ],
                id: message.id
              })
            } else {
              port.postMessage({
                type: MESSAGES.GET_PERMISSION_SUCCESS,
                data: [],
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_PERMISSION_ERROR,
              data: 'Something went wrong.',
              id: message.id
            })
          }
          break
        }

        case MESSAGES.KOI_GET_PERMISSION: {
          // console.log('KOI_GET_PERMISISON port', port)
          try {
            if (hadPermission) {
              port.postMessage({
                type: MESSAGES.KOI_GET_PERMISSION_SUCCESS,
                data: { status: 200, data: [
                  'SIGN_TRANSACTION', 
                  'ACCESS_ADDRESS', 
                  'ACCESS_PUBLIC_KEY',
                  'ACCESS_ALL_ADDRESSES',
                  'ENCRYPT',
                  'DECRYPT',
                  'SIGNATURE',
                  'ACCESS_ARWEAVE_CONFIG'
                ] },
                id: message.id
              })
            } else {
              port.postMessage({
                type: MESSAGES.KOI_GET_PERMISSION_SUCCESS,
                data: { status: 401, data: [] },
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.KOI_GET_PERMISSION_SUCCESS,
              data: { status: 500, data: 'Something went wrong.' },
              id: message.id
            })
          }
          break
        }

        case MESSAGES.CONNECT: {
          try {
            const { id } = message
            const { permissionId } = resolveId

            const savedAccountCount = await backgroundAccount.count()
            let hasAccount = !isEmpty(backgroundAccount.importedAccount)

            if (!hasAccount && !savedAccountCount) {
              const path = '/options.html'
              const url = chrome.extension.getURL(path)
              port.postMessage({
                type: MESSAGES.CONNECT_ERROR,
                data: 'Please import your wallet.',
                id
              })
              chrome.tabs.create({ url })
              return
            }
  
            if (!hadPermission) {
              permissionId.push(id)
  
              const onClosedMessage = {
                type: MESSAGES.CONNECT_ERROR,
                data: 'User cancelled the login.',
                id
              }
              if (hasPendingRequest) {
                port.postMessage({
                  type: MESSAGES.CONNECT_ERROR,
                  data: 'Request pending',
                  id
                })
                return
              }
  
              const screenWidth = screen.availWidth
              const screenHeight = screen.availHeight
              const os = window.localStorage.getItem(OS)
              let windowData = {
                url: chrome.extension.getURL('/popup.html'),
                focused: true,
                type: 'popup',
              }
              if (os == 'win') {
                windowData = {
                  ...windowData,
                  height: WINDOW_SIZE.WIN_HEIGHT,
                  width: WINDOW_SIZE.WIN_WIDTH,
                  left: Math.round((screenWidth - WINDOW_SIZE.WIN_WIDTH) / 2),
                  top: Math.round((screenHeight - WINDOW_SIZE.WIN_HEIGHT) / 2)
                }
              } else {
                windowData = {
                  ...windowData,
                  height: WINDOW_SIZE.MAC_HEIGHT,
                  width: WINDOW_SIZE.MAC_WIDTH,
                  left: Math.round((screenWidth - WINDOW_SIZE.MAC_WIDTH) / 2),
                  top: Math.round((screenHeight - WINDOW_SIZE.MAC_HEIGHT) / 2)
                }
              }
  
              createWindow(
                windowData,
                {
                  beforeCreate: async () => {
                    chrome.browserAction.setBadgeText({ text: '1' })
                    await setChromeStorage({
                      'pendingRequest': {
                        type: REQUEST.PERMISSION,
                        data: { origin, favicon, isKoi: false }
                      }
                    })
                  },
                  afterClose: async () => {
                    chrome.browserAction.setBadgeText({ text: '' })
                    port.postMessage(onClosedMessage)
                    await removeChromeStorage('pendingRequest')
                  },
                }
              )
              ports[PORTS.CONTENT_SCRIPT] = port
            } else {
              port.postMessage({
                type: MESSAGES.CONNECT_SUCCESS,
                data: 'This site has already connected.',
                id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.CONNECT_ERROR,
              data: 'Something went wrong.',
              id
            })
          }
          break
        }
        case MESSAGES.KOI_CONNECT: {
          const { id } = message
          const { permissionId } = resolveId
          try {
            /* 
              check for having 0 imported account
            */
            const savedAccountCount = await backgroundAccount.count()
            let hasImportedAccount = !isEmpty(backgroundAccount.importedAccount)
            if (!hasImportedAccount && !savedAccountCount) {
              const path = '/options.html'
              const url = chrome.extension.getURL(path)
              port.postMessage({
                type: MESSAGES.CONNECT_ERROR,
                data: 'Please import your wallet.',
                id
              })
              chrome.tabs.create({ url })
              return
            }
  
            if (!hadPermission) {
              permissionId.push(id)
  
              const onClosedMessage = {
                type: MESSAGES.KOI_CONNECT_SUCCESS,
                data: { status: 401, data: 'Connection rejected on closed.' },
                id
              }
              if (hasPendingRequest) {
                port.postMessage({
                  type: MESSAGES.KOI_CONNECT_SUCCESS,
                  data: { status: 400, data: `Request pending` },
                  id
                })
                return
              }
  
              const screenWidth = screen.availWidth
              const screenHeight = screen.availHeight
              const os = window.localStorage.getItem(OS)
              let windowData = {
                url: chrome.extension.getURL('/popup.html'),
                focused: true,
                type: 'popup',
              }
              if (os == 'win') {
                windowData = {
                  ...windowData,
                  height: WINDOW_SIZE.WIN_HEIGHT,
                  width: WINDOW_SIZE.WIN_WIDTH,
                  left: Math.round((screenWidth - WINDOW_SIZE.WIN_WIDTH) / 2),
                  top: Math.round((screenHeight - WINDOW_SIZE.WIN_HEIGHT) / 2)
                }
              } else {
                windowData = {
                  ...windowData,
                  height: WINDOW_SIZE.MAC_HEIGHT,
                  width: WINDOW_SIZE.MAC_WIDTH,
                  left: Math.round((screenWidth - WINDOW_SIZE.MAC_WIDTH) / 2),
                  top: Math.round((screenHeight - WINDOW_SIZE.MAC_HEIGHT) / 2)
                }
              }
  
              createWindow(
                windowData,
                {
                  beforeCreate: async () => {
                    chrome.browserAction.setBadgeText({ text: '1' })
                    /* 
                      Save pending request to chrome storage
                    */

                    // await setChromeStorage({
                    //   'pendingRequest': {
                    //     type: REQUEST.PERMISSION,
                    //     data: { origin, favicon, isKoi: true }
                    //   }
                    // })

                    await storage.generic.set.pendingRequest({
                      type: REQUEST.PERMISSION,
                      data: { origin, favicon, isKoi: true }
                    })
                  },
                  afterClose: async () => {
                    chrome.browserAction.setBadgeText({ text: '' })
                    port.postMessage(onClosedMessage)
                    await storage.generic.set.pendingRequest(null)
                  },
                }
              )
              ports[PORTS.CONTENT_SCRIPT] = port
            } else {
              port.postMessage({
                type: MESSAGES.KOI_CONNECT_SUCCESS,
                data: { status: 200, data: 'This site has already connected.' },
                id
              })
            }
          } catch (err) {
            console.log(err.message)
            port.postMessage({
              type: MESSAGES.KOI_CONNECT_SUCCESS,
              data: { status: 500, data: 'Something went wrong.' },
              id
            })
          }
          break
        }

        case MESSAGES.CREATE_TRANSACTION: {
          try {
            const { transaction } = message.data
            console.log('ORIGIN', origin)
            console.log('FAVICON', favicon)
            console.log('TRANSACTION', transaction)
            console.log('PERMISSION CREATE TRANSACTION', hadPermission)
  
            const { id } = message
            const { createTransactionId } = resolveId
            createTransactionId.push(id)
  
            const qty = transaction.quantity / 1000000000000
            const address = transaction.target
            const fee = 0
            console.log('QUANTITY', qty)
            console.log('ADDRESS', address)
  
            const onClosedMessage = {
              type: MESSAGES.CREATE_TRANSACTION_ERROR,
              data: 'Transaction rejected on closed.',
              id
            }
  
            chrome.runtime.getPlatformInfo((info) => {
              let windowData
  
              if (info.os == 'win') {
                windowData = {
                  url: chrome.extension.getURL('/popup.html'),
                  focused: true,
                  type: 'popup',
                  height: 628,
                  width: 426,
                }
              } else [
                windowData = {
                  url: chrome.extension.getURL('/popup.html'),
                  focused: true,
                  type: 'popup',
                  height: 628,
                  width: 426,  
                }
              ]
              createWindow (
                windowData,
                {
                  beforeCreate: async () => {
                    chrome.browserAction.setBadgeText({ text: '1' })
                    await setChromeStorage({
                      'pendingRequest': {
                        type: REQUEST.TRANSACTION,
                        data: { transaction, qty, address, origin, favicon, fee, isKoi: false }
                      }
                    })
                  },
                  afterClose: async () => {
                    chrome.browserAction.setBadgeText({ text: '' })
                    port.postMessage(onClosedMessage)
                    await removeChromeStorage('pendingRequest')
                  },
                }
              )
            })
            ports[PORTS.CONTENT_SCRIPT] = port
          } catch (err) {
            port.postMessage({
              type: MESSAGES.CREATE_TRANSACTION_ERROR,
              data: 'Something went wrong.',
              id
            })
          }
          break
        }

        case MESSAGES.KOI_CREATE_TRANSACTION: {
          try {
            const { transaction } = message.data
            console.log('ORIGIN', origin)
            console.log('FAVICON', favicon)
            console.log('TRANSACTION', transaction)
            console.log('PERMISSION CREATE TRANSACTION', hadPermission)
  
            const { id } = message
            const { createTransactionId } = resolveId
            createTransactionId.push(id)
  
            const qty = transaction.quantity
            const address = transaction.target
            const fee = transaction.fee / 1000000000000
            console.log('QUANTITY', qty)
            console.log('ADDRESS', address)
  
            const onClosedMessage = {
              type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
              data: { status: 403, data: 'Transaction rejected on closed.' },
              id
            }
  
            chrome.runtime.getPlatformInfo((info) => {
              let windowData
  
              if (info.os == 'win') {
                windowData = {
                  url: chrome.extension.getURL('/popup.html'),
                  focused: true,
                  type: 'popup',
                  height: 628,
                  width: 426,
                }
              } else [
                windowData = {
                  url: chrome.extension.getURL('/popup.html'),
                  focused: true,
                  type: 'popup',
                  height: 628,
                  width: 426,  
                }
              ]
              createWindow(
                windowData,
                {
                  beforeCreate: async () => {
                    chrome.browserAction.setBadgeText({ text: '1' })
                    await setChromeStorage({
                      'pendingRequest': {
                        type: REQUEST.TRANSACTION,
                        data: { transaction, qty, address, origin, favicon, fee, isKoi: true }
                      }
                    })
                  },
                  afterClose: async () => {
                    chrome.browserAction.setBadgeText({ text: '' })
                    port.postMessage(onClosedMessage)
                    await removeChromeStorage('pendingRequest')
                  },
                }
              )
              ports[PORTS.CONTENT_SCRIPT] = port
            })
          } catch (err) {
            port.postMessage({
              type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
              data: { status: 500, data: 'Something went wrong' },
              id
            })
          }
          break
        }

        case MESSAGES.DISCONNECT: {
          try {
            const storage = await getChromeStorage(STORAGE.SITE_PERMISSION)
            let approvedSite = storage[STORAGE.SITE_PERMISSION] || []
            approvedSite = approvedSite.filter(site => site !== origin)
            await setChromeStorage({ 'sitePermission': approvedSite })
            port.postMessage({
              type: MESSAGES.DISCONNECT_SUCCESS,
              id: message.id
            })
          } catch (err) {
            port.postMessage({
              type: MESSAGES.DISCONNECT_ERROR,
              data: 'Something went wrong',
              id: message.id
            })
          }
          break
        }

        case MESSAGES.KOI_DISCONNECT: {
          try {
            if (hadPermission) {
              const siteAdressDictionary = await storage.setting.get.siteAddressDictionary() || {}
              delete siteAdressDictionary[origin]
              await storage.setting.set.siteAddressDictionary(siteAdressDictionary)
            }

            port.postMessage({
              type: MESSAGES.KOI_DISCONNECT_SUCCESS,
              data: { status: 200, data: 'Disconnected.' },
              id: message.id
            })
          } catch (err) {
            port.postMessage({
              type: MESSAGES.KOI_DISCONNECT_SUCCESS,
              data: { status: 500, data: 'Something went wrong.' },
              id: message.id
            })
          }
          break
        }

        case MESSAGES.GET_WALLET_NAMES: {
          try {
            if (hadPermission) {
              const storage = await getChromeStorage(STORAGE.ACCOUNT_NAME)
              const accountName = storage[STORAGE.ACCOUNT_NAME]
              const payload = {
                [koi.address]: accountName
              }
              port.postMessage({
                type: MESSAGES.GET_WALLET_NAMES_SUCCESS,
                data: payload,
                id: message.id
              })
            } else {
              port.postMessage({
                type: MESSAGES.GET_WALLET_NAMES_ERROR,
                data: 'The site does not have the required permissions for this action',
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_WALLET_NAMES_ERROR,
              data: 'Something went wrong.',
              id: message.id
            })
          }
          break
        }


        case MESSAGES.KOI_REGISTER_DATA: {
          try {
            const { txId } = message.data
            const resTx = await koi.registerData(txId, koi.address)
            console.log('registerData txId', resTx)
            port.postMessage({
              type: MESSAGES.KOI_REGISTER_DATA_SUCCESS,
              data: { status: 200, data: resTx },
              id: message.id
            })
          } catch (err) {
            port.postMessage({
              type: MESSAGES.KOI_REGISTER_DATA_SUCCESS,
              data: { status: 500, data: 'Something went wrong.' },
              id: message.id
            })
          }
          break
        }

        case MESSAGES.GET_PUBLIC_KEY: {
          try {
            if (hadPermission) {
              port.postMessage({
                type: MESSAGES.GET_PUBLIC_KEY_SUCCESS,
                data: koi.wallet.n,
                id: message.id
              })
            } else {
              port.postMessage({
                type: MESSAGES.GET_PUBLIC_KEY_ERROR,
                data: 'The site does not have the required permissions for this action',
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_PUBLIC_KEY_ERROR,
              data: 'Something went wrong.',
              id: message.id
            })
          }
          break
        }

        case MESSAGES.KOI_SIGN_PORT: {
          const { txId } = message.data
          try {
            if (hadPermission) {
              if (!isString(txId)) {
                port.postMessage({
                  type: MESSAGES.KOI_SIGN_PORT_SUCCESS,
                  data: { status: 400, data: 'Invalid txId' },
                  id: message.id
                })
              } else {
                const header = await signPort(txId, koi)
                port.postMessage({
                  type: MESSAGES.KOI_SIGN_PORT_SUCCESS,
                  data: { status: 200, data: header },
                  id: message.id
                })
              }
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.SIGN_PORT_ERROR,
              data: 'Something went wrong.',
              id: message.id
            })
          }
          break
        }

        case MESSAGES.KOI_SEND_KOI: {
          const { target, qty } = message.data
          try {
            if (!isString(target) || !isNumber(qty)) {
              port.postMessage({
                type: MESSAGES.KOI_SEND_KOI_SUCCESS,
                data: { status: 400, data: 'Invalid input' },
                id: message.id
              })
            } else {
              const txId = await transfer(koi, qty, target, 'KOI')
              port.postMessage({
                type: MESSAGES.KOI_SEND_KOI_SUCCESS,
                data: { status: 200, data: txId },
                id: message.id
              })
            }
          } catch (err) {
            port.postMessage({
              type: MESSAGES.KOI_SEND_KOI_SUCCESS,
              data: { status: 500, data: err.message }
            })
          }
          break
        }

        // case ENCRYPT: {
        //   try {
        //     const { data } = message.data
        //     if (hadPermission) {
        //       const result = await koiEncrypt(data)
        //       port.postMessage({
        //         type: MESSAGES.ENCRYPT_SUCCESS,
        //         data: result,
        //         id: message.id
        //       })
        //     } else {
        //       port.postMessage({
        //         type: MESSAGES.ENCRYPT_ERROR,
        //         data: 'The site does not have the required permissions for this action',
        //         id: message.id
        //       })
        //     }
        //   } catch (err) {
        //     port.postMessage({
        //       type: MESSAGES.ENCRYPT_ERROR,
        //       data: 'Something went wrong'
        //     })
        //   }
        //   break
        // }

        default:
          break
      }
    } catch (err) {
      console.log('ERROR', err)
      port.postMessage({
        type: MESSAGES.ERROR,
        data: err.message,
        id: message.id
      })
    }
  }

  await perform()

  pendingMessages[message.type] = undefined
}
