import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import ActivityRow from './ActivityRow'

import storage from 'services/storage'
import { popupAccount } from 'services/account'
import { TYPE } from 'constants/accountConstants'

const Activity = () => {
  const [activities, setActivities] = useState([])
  useEffect(() => {
    const loadActivities = async () => {
      const activatedChain = await storage.setting.get.activatedChain()
      let displayingAccountAddress
      if (activatedChain === TYPE.ARWEAVE) displayingAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
      if (activatedChain === TYPE.ETHEREUM) displayingAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()

      const account = await popupAccount.getAccount({ address: displayingAccountAddress })
      const allActivities = await account.get.activities()
      // const allActivities = await storage.generic.get.allActivities()
      setActivities(allActivities)
    }
    loadActivities()
  }, [])

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
