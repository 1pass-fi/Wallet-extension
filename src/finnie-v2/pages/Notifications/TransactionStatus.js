import React, { useEffect, useMemo, useState } from 'react'

import TransactionRow from './TransactionRow'

import { popupAccount } from 'services/account'

const TransactionStatus = () => {
  const [transactionData, setTransactionData] = useState([])

  useEffect(() => {
    const loadTransactionData = async () => {
      const allPendingTransactions = await popupAccount.getAllPendingTransactions()
      setTransactionData(allPendingTransactions)
    }
    loadTransactionData()
  }, [])

  const columns = useMemo(() => ['Date', 'Action', 'From', 'Status', 'Block Explorer'], [])

  return (
    <div className="pt-4 text-white">
      <h1 className="text-32px font-semibold underline">Transaction Status</h1>
      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr className="text-base h-13.75 font-semibold border-b border-white px-4">
            {columns.map((col, idx) => (
              <th className="px-1" key={idx}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactionData?.reverse()?.map((transaction, idx) => (
            <TransactionRow transaction={transaction} key={idx} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionStatus
