import { useEffect } from 'react'

// services
import storage from 'services/storage'

// constants
import { SHOW_ACTIVITIES_BY } from 'constants/storageConstants'

const useSettings = ({ setSettings, setAssetsTabSettings, setError }) => {
  const loadSettings = async () => {
    try {
      const showActivitiesBy =
        (await storage.setting.get.showActivitiesBy()) || SHOW_ACTIVITIES_BY.ALL_ACCOUNTS
      const accountsToShowOnActivities =
        (await storage.setting.get.accountsToShowOnActivities()) || []
      const payload = {
        showAllAccounts: showActivitiesBy == SHOW_ACTIVITIES_BY.ALL_ACCOUNTS,
        accountsToShowOnActivities
      }
      setSettings(payload)
    } catch (err) {
      console.log(err.message)
    }
  }

  const loadAssetsTabSettings = async () => {
    try {
      const assetsTabSettings = await storage.setting.get.assetsTabSettings()

      setAssetsTabSettings(assetsTabSettings)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    loadAssetsTabSettings()
    loadSettings()
  }, [])
}

export default useSettings
