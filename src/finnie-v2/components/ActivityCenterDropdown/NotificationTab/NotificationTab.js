import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import NotificationRow from '../NotificationRow'
import { viewNotifications } from 'options/actions/notifications'

const NotificationTab = ({ notificationsData }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(viewNotifications())
    }
  }, [])
  return (
    <div style={{ overflowY: 'overlay' }} id="notifications" className="h-97.5">
      {notificationsData.notifications.map((notification, idx) =>
        notificationsData.new > idx ? (
          <NotificationRow key={idx} notification={notification} newNotification={true} />
        ) : (
          <NotificationRow key={idx} notification={notification} />
        )
      )}
    </div>
  )
}

export default NotificationTab
