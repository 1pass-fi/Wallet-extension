import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'
import { setIsLoading, setLoaded } from 'options/actions/loading'

import './ToogleButton.css'

export default ({ value, setValue, disabled, handleUpdateNft }) => {
  const dispatch = useDispatch()

  const [sending, setSending] = useState(false)

  /* value = isPrivate */
  const isPublic = useMemo(() => !value, [value])

  const onToggle = async (e) => {
    const isPrivate = !e.target.checked

    if (!disabled && !sending) {
      setSending(true)
      dispatch(setIsLoading)
      await handleUpdateNft({ isPrivate })
      setValue(isPrivate)
      setSending(false)
      dispatch(setLoaded)
    }
  }

  return (
    <label
      className={clsx('is-private-switch', (sending || disabled) && 'is-private-switch-disabled')}
    >
      <input
        className="is-private-switch-checkbox"
        type="checkbox"
        id="togBtn"
        checked={isPublic}
        onChange={onToggle}
        disabled={sending}
      />
      {isPublic ? (
        <span className="on">{chrome.i18n.getMessage('PUBLIC')}</span>
      ) : (
        <span className="off">{chrome.i18n.getMessage('PRIVATE')}</span>
      )}
      <div
        className={clsx(
          (sending || disabled) && 'is-private-switch-disabled',
          isPublic ? 'checked' : '',
          'slider round'
        )}
      ></div>
    </label>
  )
}
