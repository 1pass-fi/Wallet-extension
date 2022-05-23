export default async (scripts) => {
  const arweaveScriptElement = document.createElement('script')
  const solanaWeb3ScriptElement = document.createElement('script')
  arweaveScriptElement.src = 'https://unpkg.com/arweave/bundles/web.bundle.js'
  solanaWeb3ScriptElement.src = 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js'

  document.documentElement.appendChild(arweaveScriptElement)
  document.documentElement.appendChild(solanaWeb3ScriptElement)

  for (const script of scripts) {
    const newScriptElement = document.createElement('script')
    newScriptElement.text = script

    document.documentElement.appendChild(newScriptElement)
  }
}
