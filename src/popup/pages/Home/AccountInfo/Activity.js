import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { isEmpty, orderBy } from 'lodash'

import storage from 'services/storage'
import { popupAccount } from 'services/account'

import ActivityRow from './ActivityRow'
import ExpiredTxModal from 'popup/components/modals/expiredTxModal'

const Activity = () => {
  const [activities, setActivities] = useState([])
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [pages, setPages] = useState(1)
  const [deleteTransactionModalStatus, setDeleteTransactionModalStatus] = useState({
    isShow: false,
    txInfo: {}
  })

  useEffect(() => {
    const loadActivities = async () => {
      const allActivities = await storage.generic.get.allActivities()
      setActivities(allActivities)
    }

    const loadPendingTransactions = async () => {
      let pendingTransactions = await popupAccount.getAllPendingTransactions()
      console.log('all pending transaction', pendingTransactions)
      pendingTransactions = orderBy(pendingTransactions, 'timestamp', 'desc')
      setPendingTransactions(pendingTransactions)
    }

    loadActivities()
    loadPendingTransactions()
  }, [])

  useEffect(() => {
    const setSeen = async () => {
      const allAccounts = await popupAccount.getAllAccounts()
      allAccounts.forEach(async (account) => {
        let accountActivities = await account.get.activities()
        accountActivities = accountActivities.map((a) => {
          a.seen = true
          return a
        })
        await account.set.activities(accountActivities)
      })

      let allActivities = await storage.generic.get.allActivities()
      allActivities = allActivities.map((a) => {
        a.seen = true
        return a
      })
      await storage.generic.set.allActivities(allActivities)
    }

    if (!isEmpty(activities)) setSeen()
  }, [activities])

  const [acctivityMinHeight, setActivityMinHeight] = useState(0)
  const activityRef = useRef(null)

  useEffect(() => {
    const activityField = activityRef.current
    if (activityField) {
      const scrollHeight = activityField.scrollHeight
      if (scrollHeight < 150) {
        setActivityMinHeight(0)
        return
      }

      if (scrollHeight >= 150) {
        setActivityMinHeight(350)
        return
      }
    }
  }, [pendingTransactions, activities])

  return (
    <div
      ref={activityRef}
      style={{ minHeight: `${clsx(acctivityMinHeight)}px` }}
      className="bg-trueGray-100"
    >
      {pendingTransactions.map((activity) => (
        <ActivityRow
          key={activity.id}
          activityName={activity.activityName}
          expense={activity.expense}
          date={activity.date}
          source={activity.source}
          id={activity.id}
          pending={true}
          price={1}
          currency={'USD'}
          accountName={activity.accountName}
          seen={true}
          expired={activity.expired}
          setDeleteTransactionModalStatus={setDeleteTransactionModalStatus}
        />
      ))}
      {activities.slice(0, pages * 10).map((activity) => (
        <ActivityRow
          key={activity.id}
          activityName={activity.activityName}
          expense={activity.expense}
          date={activity.date}
          source={activity.source}
          id={activity.id}
          pending={false}
          price={1}
          currency={'USD'}
          accountName={activity.accountName}
          expired={false}
          seen={activity.seen}
        />
      ))}
      {pages * 10 < activities.length && (
        <div className="w-full text-center flex items-center justify-center">
          <button
            className="px-1.5 py-1 text-sm flex items-center justify-center bg-blue-800 text-white m-2 font-semibold rounded"
            onClick={() => {
              setPages((prev) => ++prev)
            }}
          >
            See more
          </button>
        </div>
      )}

      {deleteTransactionModalStatus.isShow && (
        <ExpiredTxModal
          txInfo={deleteTransactionModalStatus.txInfo}
          onClose={() =>
            setDeleteTransactionModalStatus((prev) => ({
              ...prev,
              isShow: false
            }))
          }
          setPendingTransactions={setPendingTransactions}
          pendingTransactions={pendingTransactions}
        />
      )}
    </div>
  )
}

export default Activity
