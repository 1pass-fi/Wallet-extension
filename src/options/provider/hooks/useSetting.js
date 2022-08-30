import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { GALLERY_IMPORT_PATH } from 'constants/koiConstants'
import { isEmpty } from 'lodash'
import storage from 'services/storage'

export default ({ walletLoaded }) => {
  const { pathname } = useLocation()

  const [showViews, setShowViews] = useState(true) // show view on setting
  const [showEarnedKoi, setShowEarnedKoi] = useState(true) // show earned koii on setting
  const [showWelcome, setShowWelcome] = useState(false) // show welcome modal

  const accounts = useSelector(state => state.accounts)

  useEffect(() => {
    const loadGallerySettings = async () => {
      const showViewStorage = await storage.setting.get.showViews()
      const showEarnedKoiStorage = await storage.setting.get.showEarnedKoi()
      const showWelcomeScreen = await storage.setting.get.showWelcomeScreen()

      if (showViewStorage !== null) setShowViews(showViewStorage)
      if (showEarnedKoiStorage !== null) setShowEarnedKoi(showEarnedKoiStorage)

      if (!showWelcomeScreen) {
        setShowWelcome(true)
        await storage.setting.set.showWelcomeScreen(1)
      }
    }

    if (!isEmpty(accounts) || !GALLERY_IMPORT_PATH.includes(pathname)) {
      loadGallerySettings()
    }
  }, [walletLoaded])

  return [
    {
      showViews,
      showEarnedKoi,
      showWelcome
    },
    {
      setShowViews,
      setShowEarnedKoi,
      setShowWelcome
    }
  ]
}
