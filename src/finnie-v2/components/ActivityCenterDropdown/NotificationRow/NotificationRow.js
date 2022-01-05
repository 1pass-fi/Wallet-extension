import moment from 'moment'
import React from 'react'

import GreenDotIcon from 'img/v2/green-dot.svg'

const NotificationRow = ({ notification, newNotification = false }) => {
  const dateFormat = (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }

  return (
    <div className="flex flex-col px-4.25 pl-5 h-18.25 border-b-2 border-gray-underline">
      <div className="w-full flex flex-col relative pt-2">
        {newNotification && (
          <div className="absolute -left-4.25 top-3.25">
            <GreenDotIcon />
          </div>
        )}
        <div className="text-xs text-blue-800 font-semibold leading-5">{notification.title}</div>
        <div className="text-xs text-blue-800 leading-5">{notification.message}</div>
      </div>
      <div className="w-full flex justify-between">
        <div className="text-xs text-blue-800 font-semibold leading-5">{notification.account}</div>
        <div className="text-xs text-blue-800 font-semibold">{dateFormat(notification.date)}</div>
      </div>
    </div>
  )
}

export default NotificationRow
