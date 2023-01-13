import React from 'react'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'
import GreenDotIcon from 'img/v2/green-dot.svg'
import moment from 'moment'
import { setNotifications } from 'options/actions/notifications'
import storage from 'services/storage'

const NotificationRow = ({ notification, newNotification = false }) => {
  const dispatch = useDispatch()

  const dateFormat = (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }

  const setRead = async () => {
    let allNotifications = await storage.generic.get.pushNotification()
    allNotifications = allNotifications.map((n) => {
      if (n.txId === notification.txId) n.new = false
      return n
    })
    dispatch(setNotifications(allNotifications))
    storage.generic.set.pushNotification(allNotifications)

    chrome.tabs.create({
      // url: `https://viewblock.io/arweave/tx/${notification.txId}`
      url: notification.blockUrl
    })
  }

  return (
    <div
      onClick={setRead}
      className={clsx(
        'flex flex-col px-4.25 pl-5 h-auto border-b-2 border-gray-underline cursor-pointer text-xs text-indigo leading-5',
        newNotification && 'font-semibold'
      )}
      title="notificationtab"
    >
      <div className="w-full flex flex-col relative pt-2">
        {newNotification && (
          <div className="absolute -left-4.25 top-3.25" title="not-seen-icon">
            <GreenDotIcon />
          </div>
        )}
        <div className="text-teal-700 overflow-hidden truncate" title="notificationtitle">{notification.title}</div>
        <div className="break-words whitespace-pre-line" title="notificationmessage">{notification.message}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>{notification.account}</div>
        <div>{dateFormat(notification.date)}</div>
      </div>
    </div>
  )
}

export default NotificationRow
