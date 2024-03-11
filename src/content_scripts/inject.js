import every from 'lodash/every'
import get from 'lodash/get'
import includes from 'lodash/includes'
import storage from 'services/storage'
import checkFileExists from 'utils/checkFileExists'
import isUrl from 'utils/isUrl'

export const getOrigin = () => {
  let origin = get(window, 'location.origin')

  if (!isUrl(origin)) return false
  return origin
}

export const checkShouldInjectFinnie = async (origin) => {
  if (!isUrl(origin)) return false

  const disabledOrigins = await storage.setting.get.disabledOrigins()
  if (!every(disabledOrigins, (_origin) => !includes(origin, _origin))) return false
  return origin
}

export const checkHasAlternativesInstalled = async () => {
  return await chrome.runtime.sendMessage('checkMetamask')
}

export const checkShouldOverwriteMetamask = async (origin, checkHasAlternativesInstalled) => {
  const hasAlternativesInstalled = await checkHasAlternativesInstalled()
  if (!hasAlternativesInstalled) return true

  const overwriteMetamaskSites = await storage.setting.get.overwriteMetamaskSites()
  const shouldOverwriteMetamask = get(
    overwriteMetamaskSites,
    [origin, 'shouldOverwriteMetamask'],
    false
  )

  return shouldOverwriteMetamask
}

export const getScriptPaths = async (shouldOverwriteMetamask) => {
  const scriptPaths = [
    '/scripts/arweave.js',
    '/scripts/solanaWeb3.js',
    '/scripts/declareConstantScript.js',
    '/scripts/eventEmitter.js',
    '/scripts/finnieRpcConnectionScript.js',
    shouldOverwriteMetamask && '/scripts/finnieEthereumProviderScript.js',
    shouldOverwriteMetamask && '/scripts/finnieArweaveProviderScript.js',
    shouldOverwriteMetamask && '/scripts/finnieSolanaProviderScript.js',
    '/scripts/finnieKoiiWalletProviderScript.js',
    '/scripts/finnieK2ProviderScript.js',
    '/scripts/mainScript.js'
  ].filter((s) => s)

  return scriptPaths
}

export const getSrcFromPath = (path) => {
  return chrome.runtime.getURL(path)
}

export const injectScriptsSequentially = (scripts) => {
  if (scripts.length > 0) {
    const script = scripts.shift()

    const element = document.createElement('script')
    element.src = script

    element.onload = () => injectScriptsSequentially(scripts)
    document.documentElement.appendChild(element)
  } else {
    dispatchFinnieIsInjected()
  }
}

export const dispatchFinnieIsInjected = async () => {
  const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
  const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')
  const ethWalletLoaded = new CustomEvent('DOMContentLoaded')

  window.dispatchEvent(arweaveWalletLoaded)
  window.dispatchEvent(finnieWalletLoaded)
  window.dispatchEvent(ethWalletLoaded)
}

export const inject = async (origin) => {
  const shouldOverwriteMetamask = await checkShouldOverwriteMetamask(
    origin,
    checkHasAlternativesInstalled
  )
  const scriptPaths = await getScriptPaths(shouldOverwriteMetamask)
  const allScriptSrc = await Promise.all(scriptPaths.map((path) => getSrcFromPath(path)))

  injectScriptsSequentially(allScriptSrc)
}

export default async () => {
  const origin = getOrigin()
  const shouldInjectFinnie = await checkShouldInjectFinnie(origin)

  if (origin?.includes('google.com')) return

  if (shouldInjectFinnie) {
    try {
      await inject(origin)
    } catch (err) {
      console.error(err)
    }
  }
}
