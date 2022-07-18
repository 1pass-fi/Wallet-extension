import React, { useEffect, useMemo, useState, useContext } from 'react'
import { useSelector } from 'react-redux'

import ActivityRow from './ActivityRow'
import DropDown from 'finnie-v2/components/DropDown'

import storage from 'services/storage'
import { popupAccount } from 'services/account'
import { TYPE } from 'constants/accountConstants'
import { GalleryContext } from 'options/galleryContext'

const Activity = () => {
  const [activities, setActivities] = useState([])
  const [accountOption, setAccountOption] = useState('ALL')

  const accounts = useSelector((state) => state.accounts)

  const accountOptions = [{ label: 'All Accounts', value: 'ALL' }].concat(
    accounts.map((account) => ({
      label: account.accountName,
      value: account.address
    }))
  )

  useEffect(() => {
    const loadActivities = async () => {
      if (accountOption !== 'ALL') {
        const account = await popupAccount.getAccount({ address: accountOption })
        const allActivities = await account.get.activities()
        console.log('accountOption', accountOption, allActivities)
        setActivities(allActivities)
      } else {
        let allActivities = []
        const accounts = await popupAccount.getAllAccounts()
        await Promise.all(
          accounts.map(async (account) => {
            const activities = await account.get.activities()
            allActivities = allActivities.concat(activities)
          })
        )
        allActivities.sort((a, b) => b.time - a.time)

        console.log('accountOption ALL', allActivities)
        setActivities(allActivities)
      }
    }
    loadActivities()
  }, [accountOption])

  const columns = useMemo(() => ['Date', 'Action', 'From', 'To', 'Amount', ''], [])

  const onSelectedAccountChanged = (address) => {
    setAccountOption(address)
  }

  console.log('activities', activities)

  return (
    <div className="pt-4 text-white">
      <h1 className="text-32px font-semibold underline">Activity</h1>
      <div className="text-sm leading-6 mt-3 mb-2.5">Select account to see activity:</div>
      <div className="mb-1.5" style={{ width: '270px' }}>
        <DropDown
          options={accountOptions}
          value={accountOption}
          onChange={onSelectedAccountChanged}
          variant="dark"
          size="lg"
          filterSupported={false}
        />
      </div>
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
