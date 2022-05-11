import React, { useEffect, useMemo, useState, useContext } from 'react'
import { useSelector } from 'react-redux'

import ActivityRow from './ActivityRow'

import storage from 'services/storage'
import { popupAccount } from 'services/account'
import { TYPE } from 'constants/accountConstants'
import { GalleryContext } from 'options/galleryContext'

const Activity = () => {
  const [activities, setActivities] = useState([])

  const { displayingAccount } = useContext(GalleryContext)

  useEffect(() => {
    const loadActivities = async () => {
      const account = await popupAccount.getAccount({ address: displayingAccount.address })
      const allActivities = await account.get.activities()
      setActivities(allActivities)
    }
    loadActivities()
  }, [displayingAccount])

  const columns = useMemo(() => ['Date', 'Action', 'From', 'To', 'Amount', ''], [])

  return (
    <div className="pt-4 text-white">
      <h1 className="text-32px font-semibold underline">Activity</h1>
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
          {activities.map((activity, idx) => (
            <ActivityRow activity={activity} key={idx} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Activity
