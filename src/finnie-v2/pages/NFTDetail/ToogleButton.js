import { GalleryContext } from 'options/galleryContext'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'

import { popupBackgroundRequest as request } from 'services/request/popup'

import './ToogleButton.css'

export default ({ value, setValue, disabled, hanldeUpdateNft }) => {
  const { setIsLoading } = useContext(GalleryContext)
  const [sending, setSending] = useState(false)

  /* value = isPrivate */
  const isPublic = useMemo(() => !value, [value])

  const onToggle = async (e) => {
    const isPrivate = !e.target.checked

    if (!disabled && !sending) {
      setValue(isPrivate)
      setSending(true)
      setIsLoading((prev) => ++prev)
      await hanldeUpdateNft({ isPrivate })
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
        defaultChecked={isPublic}
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
