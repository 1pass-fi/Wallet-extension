import { useEffect, useState } from "react";
import { 
  Transaction, 
  Connection, 
  clusterApiUrl, 
  SystemProgram 
} from '@solana/web3.js'

import { Buffer } from "buffer";

function App() {
  const [loaded, setLoaded] = useState(false)
  const [injected, setInjected] = useState(false)
  const [connectSolanaResult, setConnectSolanaResult] = useState(null)
  const [signSolanaResult, setSignSolanaResult] = useState(null)
  const [connectK2Result, setConnectK2Result] = useState(null)
  const [signK2Result, setSignK2Result] = useState(null)
  const [connectEthereumResult, setConnectEthereumResult] = useState(null)

  const signTransactionSolana = async () => {
    window.Buffer = Buffer
    const connection = new Connection(clusterApiUrl('devnet'))
    const blockHash = await connection.getLatestBlockhash()
    const feePayer = window.solana.publicKey

    const transaction = new Transaction()
    transaction.recentBlockhash = blockHash.blockhash
    transaction.feePayer = feePayer

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: new window.solanaWeb3.PublicKey('EKRyV8Ku1P9WBP65LBzNTmJbbes9dJBSV2qKq93EwNuf'),
        lamports: 0
      })
    )

    const signed = await window.solana.signTransaction(transaction)

    console.log('signed:', signed)
    console.log('transaction', transaction)

    const signedPublicKey = transaction.signatures[0].publicKey.toString()
    setSignSolanaResult(signedPublicKey)
  }

  const signTransactionK2 = async () => {
    window.Buffer = Buffer
    const connection = new Connection(clusterApiUrl('devnet'))
    const blockHash = await connection.getLatestBlockhash()
    const feePayer = window.k2.publicKey

    const transaction = new Transaction()
    transaction.recentBlockhash = blockHash.blockhash
    transaction.feePayer = feePayer

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: window.k2.publicKey,
        toPubkey: new window.solanaWeb3.PublicKey('EKRyV8Ku1P9WBP65LBzNTmJbbes9dJBSV2qKq93EwNuf'),
        lamports: 0
      })
    )

    const signed = await window.k2.signTransaction(transaction)

    console.log('signed:', signed)
    console.log('transaction', transaction)

    const signedPublicKey = transaction.signatures[0].publicKey.toString()
    setSignK2Result(signedPublicKey)
  }

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

  const disconnectSolana = async () => {
    await window.solana.disconnect()
    const isConnected = window.solana.isConnected

    if (!isConnected) setConnectSolanaResult("")
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

  const disconnectK2 = async () => {
    await window.k2.disconnect()
    const isConnected = window.k2.isConnected

    if (!isConnected) setConnectK2Result("")
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
      <div>Code injected result: <span data-testid="code-injected-result">{injected.toString()}</span></div>
      <button data-testid="code-injected-button" disabled={!loaded} onClick={checkCodeInjection}>Check code injected</button>
      <div>Connect Solana result: <span data-testid="connect-solana-result">{connectSolanaResult}</span></div>
      <div>Sign Solana result: <span data-testid="sign-solana-result">{signSolanaResult}</span></div>
      <button data-testid="connect-solana-button" onClick={connectSolana}>Connect Solana</button>
      <button data-testid="disconnect-solana-button" onClick={disconnectSolana}>Disconnect Solana</button>
      <button data-testid="sign-transaction-solana" onClick={signTransactionSolana}>Sign Transaction Solana</button>
      <div>Connect K2 result: <span data-testid="connect-k2-result">{connectK2Result}</span></div>
      <div>Sign K2 result: <span data-testid="sign-k2-result">{signK2Result}</span></div>
      <button data-testid="connect-k2-button" onClick={connectK2}>Connect K2</button>
      <button data-testid="disconnect-k2-button" onClick={disconnectK2}>Disconnect K2</button>
      <button data-testid="sign-transaction-k2" onClick={signTransactionK2}>Sign Transaction K2</button>
      <div>Connect Ethereum result: {connectEthereumResult}</div>
      <button onClick={connectEthereum}>Connect Ethereum</button>
      <button onClick={disconnectEthereum}>Disconnect Ethereum</button>
    </div>  
  );
}

export default App;
