import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'

import storage from 'services/storage'
import { popupAccount } from 'services/account'

import ActivityRow from './ActivityRow'

const Activity = () => {
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
      allAccounts.forEach(async (account) => {
        let accountActivities = await account.get.activities()
        accountActivities = accountActivities.map((a) => {
          a.seen = true
          return a
        })
        await account.set.activities(accountActivities)
      })

      let allActivities = await storage.generic.get.allActivities()
      allActivities = allActivities.map((a) => {
        a.seen = true
        return a
      })
      await storage.generic.set.allActivities(allActivities)
    }

    if (!isEmpty(activities)) setSeen()
  }, [activities])

  return (
    <div>
      {activities.slice(0, pages * 10).map((activity) => (
        <ActivityRow
          key={activity.id}
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
        />
      ))}
      {pages * 10 < activities.length && (
        <div className="w-full text-center">
          <button
            className="w-20 h-5 bg-blue-800 text-white m-2 font-semibold rounded"
            onClick={() => {
              setPages((prev) => ++prev)
            }}
          >
            See more
          </button>
        </div>
      )}
    </div>
  )
}

export default Activity
