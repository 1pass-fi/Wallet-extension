import { MESSAGES } from 'constants/koiConstants'
import storage from 'services/storage'

export default async (fn, fn1) => {
  const script = document.createElement('script')
  const eventEmitter = document.createElement('script')
  const arweaveScript = document.createElement('script')
  
  eventEmitter.text = `(${fn1})();`
  script.text = `const MESSAGE_TYPES = JSON.parse('${JSON.stringify(MESSAGES)}');(${fn.toString()})();`
  arweaveScript.src = 'https://unpkg.com/arweave/bundles/web.bundle.js'

  document.documentElement.appendChild(eventEmitter)
  document.documentElement.appendChild(arweaveScript)
  document.documentElement.appendChild(script)
}
