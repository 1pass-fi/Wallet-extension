import React, { useEffect,useState } from 'react'
import {
  clusterApiUrl as clusterApiUrlK2,
  Connection as ConnectionK2,
  Keypair as KeypairK2,
  LAMPORTS_PER_SOL as LAMPORTS_PER_SOLK2,
  PublicKey as PublicKeyK2,
  sendAndConfirmTransaction as sendAndConfirmTransactionK2,
  SystemProgram as SystemProgramK2,
  Transaction as TransactionK2} from '@_koi/web3.js'
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Message,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction} from '@solana/web3.js'
import base58 from 'bs58'
import { get, isEmpty,isNumber } from 'lodash'
import arweave from 'services/arweave'
import storage from 'services/storage'
import { fromLampToSol,numberFormat } from 'utils'
// import Web3 from 'web3'
const Web3 = () => ({})


const fromHexToDecimal = (hexString) => {
  let number = null
  if (hexString) number = parseInt(hexString, 16)

  return number
}

const fromWeiToEth = (wei) => {
  return wei / 1000000000000000000
}

const useGetFee = ({ network, transactionPayload }) => {
  const [totalFee, setTotalFee] = useState('------')
  const [tokenSymbol, setTokenSymbol] = useState('------')
  const [getFeeInterval, setGetFeeInterval] = useState(null)

  const getEthFee = async () => {
    const provider = await storage.setting.get.ethereumProvider()
    const web3 = new Web3(provider)

    const sourceAddress = get(transactionPayload, 'from')
    const recipientAddress = get(transactionPayload, 'to')
    const value = fromHexToDecimal(get(transactionPayload, 'value'))
    const transactionData = get(transactionPayload, 'data')
    const estimatedGas = get(transactionPayload, 'gas')
    const maxFeePerGas = get(transactionPayload, 'maxFeePerGas')
    const maxPriorityFeePerGas = get(transactionPayload, 'maxPriorityFeePerGas')

    const rawTx = {}
    rawTx.from = sourceAddress
    if (recipientAddress) rawTx.to = recipientAddress
    if (value) rawTx.value = value
    if (transactionData) rawTx.data = transactionData
    if (maxFeePerGas) rawTx.maxFeePerGas = maxFeePerGas
    if (maxPriorityFeePerGas) rawTx.maxPriorityFeePerGas = maxPriorityFeePerGas

    console.log('rawTx', rawTx)

    const gasPrice = await web3.eth.getGasPrice()
    const gasUsed = await web3.eth.estimateGas(rawTx)

    console.log('gasPrice', gasPrice)

    const gasFee = gasUsed * gasPrice
    setTotalFee(fromWeiToEth(gasFee))
    setTokenSymbol('ETH')
  }

  const getArFee = async () => {
    const rawTx = {}

    const recipientAddress = get(transactionPayload, 'to')
    const value = get(transactionPayload, 'value')
    const storedTransactionData = (await storage.generic.get.transactionData())?.data
    let transactionData = null
    if (!isEmpty(storedTransactionData)) {
      transactionData = Buffer.from(Object.values(JSON.parse(storedTransactionData)))
    } else {
      transactionData = get(transactionPayload, 'data')
    }

    if (recipientAddress) rawTx.target = recipientAddress
    if (isNumber(value)) rawTx.quantity = value.toString()
    if (transactionData) rawTx.data = Buffer.from(transactionData)

    const transaction = await arweave.createTransaction(rawTx)
    let fee = await arweave.transactions.getPrice(transaction.data_size)
    fee = fee / 1000000000000

    setTotalFee(fee)
    setTokenSymbol('AR')
  }

  const getSolFee = async () => {
    const recipientAddress = get(transactionPayload, 'to')
    const senderAddress = get(transactionPayload, 'from')
    const value = get(transactionPayload, 'value')
    const transactionMessage = get(transactionPayload, 'transactionMessage')

    const solProvider = (await storage.setting.get.solanaProvider()) || 'testnet'
    const connection = new Connection(clusterApiUrl(solProvider), 'confirmed')

    if (senderAddress && recipientAddress) {
      const transaction = new Transaction()
  
      let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash
  
      transaction.recentBlockhash = blockhash
      transaction.feePayer = new PublicKey(senderAddress)
  
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(senderAddress),
          toPubkey: new PublicKey(recipientAddress),
          lamports: value
        })
      )
  
      const response = await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')
  
      setTotalFee(fromLampToSol(response.value))
      setTokenSymbol('SOL')
    } else {
      const message = Message.from(base58.decode(transactionMessage))
      const response = await connection.getFeeForMessage(message, 'confirmed')
      
      setTotalFee(fromLampToSol(response.value))
      setTokenSymbol('SOL')
    }
  }

  const getK2Fee = async () => {
    const recipientAddress = get(transactionPayload, 'to')
    const senderAddress = get(transactionPayload, 'from')
    const value = get(transactionPayload, 'value')

    const transaction = new TransactionK2()
    // TODO Minh Vu load provider from storage
    const k2Provider = (await storage.setting.get.k2Provider()) || 'testnet'
    const connection = new ConnectionK2(clusterApiUrlK2(k2Provider), 'confirmed')
    console.log('getK2Fee k2Provider =========', connection)
    
    let blockhash = (await connection.getRecentBlockhash('finalized')).blockhash
    console.log('getK2Fee k2Provider =========', blockhash)

    transaction.recentBlockhash = blockhash
    transaction.feePayer = new PublicKeyK2(senderAddress)

    transaction.add(
      SystemProgramK2.transfer({
        fromPubkey: new PublicKeyK2(senderAddress),
        toPubkey: new PublicKeyK2(recipientAddress),
        lamports: value
      })
    )

    const response = await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')

    setTotalFee(fromLampToSol(response.value))
    setTokenSymbol('KOII')
  }

  useEffect(() => {
    const load = () => {
      try {
        if (network === 'ETHEREUM') {
          getEthFee()
          setGetFeeInterval(
            setInterval(() => {
              getEthFee()
            }, 3000)
          )
        }
        if (network === 'ARWEAVE') getArFee()
        if (network === 'SOLANA') getSolFee()
        if (network === 'K2') getK2Fee()
      } catch (err) {
        console.error('get fee error: ', err.message)
      }
    }

    if (transactionPayload && network) load()
  }, [transactionPayload, network])

  const Fee = () => (
    <div>
      {isNumber(totalFee) ? numberFormat(totalFee, 8) : totalFee} {tokenSymbol}
    </div>
  )

  return { Fee, totalFee, tokenSymbol, getFeeInterval }
}

export default useGetFee
