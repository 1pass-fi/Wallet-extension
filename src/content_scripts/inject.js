import { MESSAGES } from 'constants/koiConstants'

export default (fn) => {
  const script = document.createElement('script')
  const arweaveScript = document.createElement('script')

  script.text = `const MESSAGE_TYPES = JSON.parse('${JSON.stringify(MESSAGES)}');(${fn.toString()})();`
  arweaveScript.src = 'https://unpkg.com/arweave/bundles/web.bundle.js'

  document.documentElement.appendChild(arweaveScript)
  document.documentElement.appendChild(script)
}
