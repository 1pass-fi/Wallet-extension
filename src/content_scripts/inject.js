export default async (scripts) => {
  const arweaveScriptElement = document.createElement('script')
  arweaveScriptElement.src = 'https://unpkg.com/arweave/bundles/web.bundle.js'

  document.documentElement.appendChild(arweaveScriptElement)

  for (const script of scripts) {
    const newScriptElement = document.createElement('script')
    newScriptElement.text = script

    document.documentElement.appendChild(newScriptElement)
  }
}
