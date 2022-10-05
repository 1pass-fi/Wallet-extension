import React, { useEffect,useState } from 'react'
import { get, isEmpty,isNumber } from 'lodash'
import arweave from 'services/arweave'
import storage from 'services/storage'
import { numberFormat } from 'utils'


const useGetFee = ({ network, transactionPayload }) => {
  const [totalFee, setTotalFee] = useState('------')
  const [tokenSymbol, setTokenSymbol] = useState('------')

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

  useEffect(() => {
    const load = () => {
      try {
        getArFee()
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

  return { Fee, totalFee, tokenSymbol }
}

export default useGetFee
