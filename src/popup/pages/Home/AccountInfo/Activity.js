import React, { useEffect,useRef, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import clsx from 'clsx'
import { isEmpty, orderBy } from 'lodash'
import { setActivities } from 'popup/actions/activities'
import ExpiredTxModal from 'popup/components/modals/expiredTxModal'
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'
import { popupAccount } from 'services/account'
import storage from 'services/storage'

import ActivityRow from './ActivityRow'

const Activity = ({ activities, setActivities }) => {
  const displayingAccount = useSelector(getDisplayingAccount)
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [pages, setPages] = useState(1)
  const [deleteTransactionModalStatus, setDeleteTransactionModalStatus] = useState({
    isShow: false,
    txInfo: {}
  })

  const [accountActivites, setAccountActivites] = useState([])

  useEffect(() => {
    const loadActivities = async () => {
      const account = await popupAccount.getAccount({ address: displayingAccount.address })
      // const allActivities = await account.get.activities()
      const allActivities = await storage.generic.get.allActivities()
      setAccountActivites(allActivities)
    }

    const loadPendingTransactions = async () => {
      let pendingTransactions = await popupAccount.getAllPendingTransactions()
      console.log('all pending transaction', pendingTransactions)
      pendingTransactions = orderBy(pendingTransactions, 'timestamp', 'desc')
      setPendingTransactions(pendingTransactions)
    }
 
    loadActivities()
    loadPendingTransactions()
  }, [activities])

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

    if (!isEmpty(accountActivites)) setSeen()
  }, [accountActivites])

  const [acctivityMinHeight, setActivityMinHeight] = useState(0)
  const activityRef = useRef(null)

  useEffect(() => {
    console.log('accountActivies:', accountActivites)
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
  }, [pendingTransactions, accountActivites])

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
          network={activity.network}
          isK2Account={activity.isK2Account}
          setDeleteTransactionModalStatus={setDeleteTransactionModalStatus}
          isProcessing={activity.isProcessing}
          isEthAccount={activity.isEthAccount}
        />
      ))}
      {accountActivites.slice(0, pages * 10).map((activity) => (
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
          network={activity.network}
          seen={activity.seen}
          isK2Account={activity.isK2Account}
          isEthAccount={activity.isEthAccount}
        />
      ))}
      {pages * 10 < accountActivites.length && (
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

const mapStateToProps = (state) => ({
  activities: state.activities
})

export default connect(mapStateToProps, {
  setActivities
})(Activity)
