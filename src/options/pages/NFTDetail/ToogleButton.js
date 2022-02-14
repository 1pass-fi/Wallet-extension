import { GalleryContext } from 'options/galleryContext'
import React, { useContext, useMemo, useState } from 'react'
import clsx from 'clsx'

import { popupBackgroundRequest as request } from 'services/request/popup'

import './ToogleButton.css'

export default ({ value, setValue, disabled, handleUpdateNft }) => {
  const { setIsLoading } = useContext(GalleryContext)
  const [sending, setSending] = useState(false)

  /* value = isPrivate */
  const isPublic = useMemo(() => !value, [value])

  const onToggle = async (e) => {
    const isPrivate = !e.target.checked

    if (!disabled && !sending) {
      setSending(true)
      setIsLoading((prev) => ++prev)
      await handleUpdateNft({ isPrivate })
      setValue(isPrivate)
      setSending(false)
      setIsLoading((prev) => --prev)
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
      {isPublic ? <span className="on">PUBLIC</span> : <span className="off">PRIVATE</span>}
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
