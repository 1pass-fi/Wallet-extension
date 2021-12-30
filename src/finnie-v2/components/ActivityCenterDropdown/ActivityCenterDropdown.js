import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import clsx from 'clsx'

import storage from 'services/storage'
import ActivityRow from './ActivityRow'

import './ActivityCenterDropdown.css'
import { popupAccount } from 'services/account'

const ACTIVITY = 'ACTIVITY'
const COMMUNITY = 'COMMUNITY'
const NOTIFICATION = 'NOTIFICATION'

const ActivityCenterDropdown = () => {
  const [tab, setTab] = useState(ACTIVITY)
  const [activities, setActivities] = useState([])
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const loadActivities = async () => {
      const allActivities = await storage.generic.get.allActivities()
      setActivities(allActivities)
    }
    loadActivities()
  }, [])

  useEffect(() => {
    const setSeen = async () => {
      const allAccounts = await popupAccount.getAllAccounts()
      allAccounts.forEach(async account => {
        let accountActivities = await account.get.activities()
        accountActivities = accountActivities.map(a => {a.seen = true; return a})
        await account.set.activities(accountActivities)
      })

      let allActivities = await storage.generic.get.allActivities()
      allActivities = allActivities.map(a => {a.seen = true; return a})
      await storage.generic.set.allActivities(allActivities)
    }

    if (!isEmpty(activities)) setSeen()
  }, [activities])

  return (
    <div className="w-90.5 h-130.75 bg-white box-border border-0 rounded-1 fixed right-16.25 top-18.25 z-50 p-2.75">
      <div className='flex justify-between items-center h-12 border-b-2 border-gray-underline'>
        <div className="text-base font-semibold text-blue-800">ACTIVITY CENTER</div>
        <a className='text-sm font-normal text-success-700 underline' href='#'>See All</a>
      </div>
      <div className={clsx(
        'flex justify-between items-center h-15.75 border-gray-underline border-b-2',
        'text-center text-sm px-4.25'
      )}>
        <div 
          className={clsx('cursor-pointer', tab === COMMUNITY ? 'font-semibold border-b-2 border-success-700' : 'text-sm text-blue-800')}
          onClick={() => setTab(COMMUNITY)}
        >Community</div>
        <div 
          className={clsx('cursor-pointer', tab === ACTIVITY ? 'font-semibold border-b-2 border-success-700' : 'text-sm text-blue-800')}
          onClick={() => setTab(ACTIVITY)}
        >Activity</div>
        <div 
          className={clsx('cursor-pointer', tab === NOTIFICATION ? 'font-semibold border-b-2 border-success-700' : 'text-sm text-blue-800')}
          onClick={() => setTab(NOTIFICATION)}
        >Notification</div>
      </div>
      {tab === ACTIVITY && <div id='activities' className='h-97.5 overflow-y-scroll'>
        {activities.slice(0, pages * 10).map(activity => <ActivityRow
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
          seen={activity.seen}
        />)}
        <div className='w-full text-center'><button className='w-20 h-5 bg-blue-800 text-white m-2 font-semibold rounded' onClick={() => setPages(prev => ++prev)}>See more</button></div>
      </div>}
    </div>
  )
}

export default ActivityCenterDropdown
