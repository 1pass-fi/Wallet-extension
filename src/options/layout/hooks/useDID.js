import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'

import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

export default ({ walletLoaded, newAddress, setIsLoading, setError }) => {
  const kidLinkPrefix = 'https://koii.id/'
  const [userKID, setuserKID] = useState({
    kidLink: kidLinkPrefix,
    name: '',
    country: '',
    pronouns: '',
    description: '',
  })
  const [kID, setkID] = useState('')
  const [hadData, setHadData] = useState(false)
  const [didID, setDidID] = useState(null)
  const [profilePictureId, setProfilePictureId] = useState(null)
  const [bannerId, setBannerId] = useState(null)
  const [linkAccounts, setLinkAccounts] = useState([{ title: '', link: '' }])
  const [customCss, setCustomCss] = useState('')
  const [usingCustomCss, setUsingCustomCss] = useState(false)
  const [expandedCssEditor, setExpandedCssEditor] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [oldkID, setOldkID] = useState('')

  const getDID = async () => {
    try {
      setIsLoading(prev => ++prev)
      const defaultAccountAddress = await storage.setting.get.activatedAccountAddress()
      let state, id
      try {
        const result = await backgroundRequest.gallery.getDID({ address: defaultAccountAddress })
        state = result.state
  
        if (!isEmpty(state)) {
          setHadData(true)
        } else {
          setHadData(false)
        }
  
        id = result.id
      } catch (err) {
        console.error(err.message)
        setHadData(false)
        state = {
          links: [{ title: '', link: '' }],
          name: '',
          description: '',
          country: '',
          pronouns: '',
          kID: '',
          code: '',
          styles: []
        }
      }
  
      const _userKID = {
        kidLink: state.kID ? `https://koii.id/${state.kID}` : 'https://koii.id/',
        name: state.name,
        description: state.description,
        country: state.country,
        pronouns: state.pronouns
      }
  
      console.log('STATE=======', state)

      setDidID(id)
      setuserKID(prev => ({...prev, ..._userKID}))
    
      setProfilePictureId(state.picture)
      setBannerId(state.banner)
      setCustomCss(state.code)
      setUsingCustomCss(!isEmpty(state.code))
    
      setLinkAccounts(state.links)
      setkID(state.kID)
      setOldkID(state.kID)
      setIsLoading(prev => --prev)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (walletLoaded) getDID()
  }, [walletLoaded, newAddress])

  return [
    {
      userKID,
      kID,
      hadData,
      didID,
      profilePictureId,
      bannerId,
      linkAccounts,
      customCss,
      usingCustomCss,
      expandedCssEditor,
      showModal,
      modalType,
      oldkID,
      getDID
    },
    {
      setuserKID,
      setkID,
      setHadData,
      setDidID,
      setProfilePictureId,
      setBannerId,
      setLinkAccounts,
      setCustomCss,
      setUsingCustomCss,
      setExpandedCssEditor,
      setShowModal,
      setModalType,
      setOldkID
    },
    getDID
  ]
}
