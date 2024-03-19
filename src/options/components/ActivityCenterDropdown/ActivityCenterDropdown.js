import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { setNotifications } from 'options/actions/notifications'
import { getDisplayingAccount } from 'options/selectors/displayingAccount'
import { popupAccount } from 'services/account'
import storage from 'services/storage'

import ActivityRow from './ActivityRow'
import NotificationTab from './NotificationTab'

import './ActivityCenterDropdown.css'

const ACTIVITY = 'ACTIVITY'
const COMMUNITY = 'COMMUNITY'
const NOTIFICATION = 'NOTIFICATION'

const ActivityCenterDropdown = React.forwardRef((_, ref) => {
  const [tab, setTab] = useState(ACTIVITY)
  const [activities, setActivities] = useState([])
  const [pages, setPages] = useState(1)
  const displayingAccount = useSelector(getDisplayingAccount)

  const dispatch = useDispatch()

  const notificationsData = useSelector((state) => state.notificationsData)

  useEffect(() => {
    const loadActivities = async () => {
      const account = await popupAccount.getAccount({ address: displayingAccount.address })
      const allActivities = await account.get.activities()
      setActivities(allActivities)
    }
    loadActivities()
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

  const setReadNotifications = async () => {
    // clear notifications
    let allNotifications = await storage.generic.get.pushNotification()
    allNotifications = allNotifications.map((n) => {
      n.new = false
      return n
    })
    dispatch(setNotifications(allNotifications))
    storage.generic.set.pushNotification(allNotifications)
  }

  return (
    <div
      ref={ref}
      className="w-90.5 h-130.75 bg-white box-border border-0 rounded-1 fixed right-16.25 top-18.25 z-50 p-2.75"
    >
      <div className="flex justify-between items-center h-12 border-b-2 border-gray-underline">
        <div className="text-base font-semibold text-blue-800">
          {chrome.i18n.getMessage('activityCenterUc')}
        </div>
        <Link
          className="text-sm font-normal text-success-700 underline"
          to="/notifications/activity"
          onClick={setReadNotifications}
        >
          {chrome.i18n.getMessage('seeAll')}
        </Link>
      </div>
      <div
        className={clsx(
          'flex justify-evenly items-center h-15.75 border-gray-underline border-b-2',
          'text-center text-sm px-4.25'
        )}
      >
        {/* <div
          className={clsx(
            'cursor-pointer text-blue-800',
            tab === COMMUNITY ? 'font-semibold border-b-2 border-success-900' : 'text-sm'
          )}
          onClick={() => setTab(COMMUNITY)}
        >
          Community
        </div> */}
        <div
          className={clsx(
            'cursor-pointer text-blue-800',
            tab === ACTIVITY ? 'font-semibold border-b-2 border-success-900' : 'text-sm '
          )}
          onClick={() => setTab(ACTIVITY)}
        >
          {chrome.i18n.getMessage('activity')}
        </div>
        <div
          className={clsx(
            'cursor-pointer text-blue-800',
            tab === NOTIFICATION ? 'font-semibold border-b-2 border-success-900' : 'text-sm'
          )}
          onClick={() => setTab(NOTIFICATION)}
        >
          {chrome.i18n.getMessage('notification')}
        </div>
      </div>

      {tab === ACTIVITY && (
        <div style={{ overflowY: 'overlay' }} id="activities" className="h-97.5">
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
              network={activity.network}
              seen={activity.seen}
              isK2Account={activity.isK2Account}
            />
          ))}
          {pages * 10 < activities.length && (
            <div className="w-full text-center">
              <button
                className="w-20 h-5 bg-blue-800 text-white m-2 font-semibold rounded"
                onClick={() => {
                  setPages((prev) => ++prev)
                }}
              >
                {chrome.i18n.getMessage('seeMore')}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === NOTIFICATION && <NotificationTab notificationsData={notificationsData} />}
    </div>
  )
})

export default ActivityCenterDropdown
