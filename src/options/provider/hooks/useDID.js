import { useEffect,useState } from 'react'
import { useDispatch } from 'react-redux'
import { toCSS, toJSON } from 'cssjson'
import { isEmpty } from 'lodash'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'

import fromStyleToCss from './fromStyleToCss'
export default ({ walletLoaded, newAddress, setError }) => {
  const dispatch = useDispatch()

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
  const [cssTemplate, setCssTemplate] = useState({
    'children': {
      '.description': {
        'children': {},
        'attributes': {}
      },
      '.name': {
        'children': {},
        'attributes': {}
      },
      '.links': {
        'children': {},
        'attributes': {}
      },
      '.background': {
        'children': {},
        'attributes': {}
      },
      '.content-area': {
        'children': {},
        'attributes': {}
      },
      '.wallet-address': {
        'children': {},
        'attributes': {}
      },
      '.did-label': {
        'children': {},
        'attributes': {}
      },
      '.address-name': {
        'children': {},
        'attributes': {}
      },
      '.address-value': {
        'children': {},
        'attributes': {}
      },
      '.show-address-button': {
        'children': {},
        'attributes': {}
      },

    }
  })

  const getDID = async () => {
    try {
      dispatch(setIsLoading)
      const defaultAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
      console.log('defaultAccountAddress', defaultAccountAddress)
      let state, id
      try {
        const account = await popupAccount.getAccount({ address: defaultAccountAddress })
        let result = await account.get.didData()
        if (isEmpty(result)) result = await backgroundRequest.gallery.getDID({ address: defaultAccountAddress })
        else backgroundRequest.gallery.getDID({ address: defaultAccountAddress })
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
  
      const newStyle = fromStyleToCss(state.styles)
      const _cssTemplate = {...cssTemplate}
      _cssTemplate['children'] = {..._cssTemplate['children'], ...newStyle}
      setCssTemplate(_cssTemplate)

      setDidID(id)
      setuserKID(prev => ({...prev, ..._userKID}))
    
      setProfilePictureId(state.picture)
      setBannerId(state.banner)
      // setCustomCss(state.code)
      setUsingCustomCss(!isEmpty(state.code))
    
      setLinkAccounts(state.links)
      setkID(state.kID)
      setOldkID(state.kID)
      dispatch(setLoaded)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const displayCssTemplate = () => {
      setCustomCss(toCSS(cssTemplate))
    }

    displayCssTemplate()
  }, [cssTemplate])

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
      getDID,
      cssTemplate
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
      setOldkID,
      setCssTemplate
    },
    getDID
  ]
}
