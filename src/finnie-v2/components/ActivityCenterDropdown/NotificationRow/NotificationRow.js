import moment from 'moment'
import React from 'react'
import { useDispatch } from 'react-redux'

import GreenDotIcon from 'img/v2/green-dot.svg'
import storage from 'services/storage'
import { setNotifications } from 'options/actions/notifications'

const NotificationRow = ({ notification, newNotification = false }) => {
  const dispatch = useDispatch()
  
  const dateFormat = (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }

  const setRead = async () => {
    let allNotifications = await storage.generic.get.pushNotification()
    allNotifications = allNotifications.map(n => {if (n.txId === notification.txId) n.new = false; return n})
    dispatch(setNotifications(allNotifications))
    storage.generic.set.pushNotification(allNotifications)

    chrome.tabs.create({
      url: `https://viewblock.io/arweave/tx/${notification.txId}`
    })
  }

  return (
    <div onClick={setRead} className="flex flex-col px-4.25 pl-5 h-18.25 border-b-2 border-gray-underline cursor-pointer">
      <div className="w-full flex flex-col relative pt-2">
        {newNotification && (
          <div className="absolute -left-4.25 top-3.25">
            <GreenDotIcon />
          </div>
        )}
        <div className="text-xs text-blue-800 font-semibold leading-5">{notification.title}</div>
        <div className="text-xs text-blue-800 leading-5 h-5.25 overflow-hidden">{notification.message}</div>
      </div>
      <div className="w-full flex justify-between">
        <div className="text-xs text-blue-800 font-semibold leading-5">{notification.account}</div>
        <div className="text-xs text-blue-800 font-semibold">{dateFormat(notification.date)}</div>
      </div>
    </div>
  )
}

export default NotificationRow
