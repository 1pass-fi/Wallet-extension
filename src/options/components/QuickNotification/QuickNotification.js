import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { GALLERY_IMPORT_PATH } from 'constants/koiConstants'
import includes from 'lodash/includes'
import { clearQuickNotification } from 'options/actions/quickNotification'
import Message from 'options/components/Message'

const QuickNotification = () => {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const quickNotification = useSelector((state) => state.quickNotification)

  const isImportWalletPath = includes(GALLERY_IMPORT_PATH, pathname)

  useEffect(() => {
    if (quickNotification) {
      const timer = setTimeout(() => dispatch(clearQuickNotification), 4000)
      return () => clearTimeout(timer)
    }
  }, [quickNotification])

  if (quickNotification && !isImportWalletPath)
    return <Message children={quickNotification} type="notification" />
  return ''
}

export default QuickNotification
