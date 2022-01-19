import React from 'react'

import NotificationRow from '../NotificationRow'


const NotificationTab = ({ notificationsData }) => {
  return (
    <div style={{ overflowY: 'overlay' }} id="notifications" className="h-97.5">
      {notificationsData.notifications.map((notification, idx) =>
        <NotificationRow key={idx} notification={notification} newNotification={notification.new} />
      )}
    </div>
  )
}

export default NotificationTab
