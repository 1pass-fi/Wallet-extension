import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { TYPE } from 'constants/accountConstants'
import DropDown from 'options/components/DropDown'
import { GalleryContext } from 'options/galleryContext'
import { popupAccount } from 'services/account'
import storage from 'services/storage'
import { v4 as uuid } from 'uuid'
import DropdownNew from 'sharedComponents/Dropdown'

import ActivityRow from './ActivityRow'

const Activity = () => {
  const [activities, setActivities] = useState([])
  const [accountOption, setAccountOption] = useState('ALL')

  const accounts = useSelector((state) => state.accounts)

  const accountOptions = [{ label: chrome.i18n.getMessage('allAccounts'), value: 'ALL' }].concat(
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

        setActivities(allActivities)
      }
    }
    loadActivities()
  }, [accountOption])

  const columns = useMemo(() => ['Date', 'Action', 'From', 'To', 'Amount', ''], [])

  const onSelectedAccountChanged = (address) => {
    setAccountOption(address)
  }

  return (
    <div className="pt-4 text-white">
      <h1 className="text-32px font-semibold underline">{chrome.i18n.getMessage('activity')}</h1>
      <div className="text-sm leading-6 mt-3 mb-2.5">
        {chrome.i18n.getMessage('activitySelectAccount')}:
      </div>
      <div className="mb-1.5" style={{ width: '270px' }}>
        {/* <DropDown
          options={accountOptions}
          value={accountOption}
          onChange={onSelectedAccountChanged}
          variant="dark"
          size="lg"
          filterSupported={false}
        /> */}
        <DropdownNew options={accountOptions} value={accountOption} onChange={onSelectedAccountChanged} />        
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
            <ActivityRow activity={activity} key={uuid()} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Activity
