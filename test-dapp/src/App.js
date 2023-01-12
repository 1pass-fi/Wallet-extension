import { useEffect, useState } from "react";

function App() {
  const [loaded, setLoaded] = useState(false)
  const [injected, setInjected] = useState(false)
  const [connectSolanaResult, setConnectSolanaResult] = useState(null)
  const [connectK2Result, setConnectK2Result] = useState(null)
  const [connectEthereumResult, setConnectEthereumResult] = useState(null)

  const checkCodeInjection = () => {
    setInjected(!!window.arweaveWallet && !!window.solana && !!window.k2)
  }

  const connectSolana = async () => {
    try {
      const result = await window.solana.connect()
      setConnectSolanaResult(result.toString())
    } catch (err) {
      console.log(err.data)
      setConnectSolanaResult(err.data)
    }
  }

  const disconnectSolana = () => {
    window.solana.disconnect()
  }

  const connectK2 = async () => {
    try {
      const result = await window.k2.connect()
      setConnectK2Result(result.toString())
    } catch (err) {
      console.log(err.data)
      setConnectK2Result(err.data)
    }
  }

  const disconnectK2 = () => {
    window.k2.disconnect()
  }

  const connectEthereum = async () => {
    try {
      const result = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setConnectEthereumResult(result[0])
    } catch (err) {
      console.log(err.data)
      setConnectEthereumResult(err.data)
    }
  }

  const disconnectEthereum = () => {
    try {

    } catch (err) {

    }
  }

  useEffect(() => {
    window.addEventListener('finnieWalletLoaded', () => {
      setLoaded(true)
    })
  }, [])

  return (
    <div className="App">
      <div>Code injected: {injected.toString()}</div>
      <button disabled={!loaded} onClick={checkCodeInjection}>Check code injected</button>
      <div>Connect Solana result: {connectSolanaResult}</div>
      <button onClick={connectSolana}>Connect Solana</button>
      <button onClick={disconnectSolana}>Disconnect Solana</button>
      <div>Connect K2 result: {connectK2Result}</div>
      <button onClick={connectK2}>Connect K2</button>
      <button onClick={disconnectK2}>Disconnect K2</button>
      <div>Connect Ethereum result: {connectEthereumResult}</div>
      <button onClick={connectEthereum}>Connect Ethereum</button>
      <button onClick={disconnectEthereum}>Disconnect Ethereum</button>
    </div>
  );
}

export default App;
