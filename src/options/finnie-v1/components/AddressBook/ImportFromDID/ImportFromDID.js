import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import clsx from 'clsx'

import CloseIcon from 'img/ab-close-icon.svg'
import Avatar from 'img/ab-avatar.png'

import { getDIDs } from 'background/helpers/did/koiiMe'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

const ImportFromDID = ({ onClose, storeDIDAddress }) => {
  const [clicked, setClicked] = useState(false)
  const [didLink, setDidLink] = useState('')
  const [invalidDIDLink, setInvalidDIDLink] = useState(false)
  const kidLinkPrefix = 'https://koii.id/'

  const getDID = (link) => {
    if (link.startsWith(kidLinkPrefix) && link.length !== 16) return link.substring(16, link.length)
    return false
  }

  const handleImportDID = async () => {
    try {
      setClicked(true)

      const did = getDID(didLink)
      if (!did) {
        setInvalidDIDLink(true)
        setClicked(false)
        return
      }

      const allDIDs = await getDIDs()
      const didInfo = get(allDIDs, did)
      const ownerAddress = get(didInfo, 'owner')
      if (isEmpty(didInfo)) {
        setInvalidDIDLink(true)
        setClicked(false)
        return
      }

      let result = await backgroundRequest.gallery.getDID({ address: ownerAddress })
      result.didValue = didLink
      setClicked(false)
      storeDIDAddress(result)
    } catch (error) {
      setClicked(false)
    }
  }
  return (
    <div
      style={{
        width: '411px',
        height: '486px',
        backgroundColor: '#3E3E71',
        boxShadow: 'inset 8px 0 10px -6px rgba(0, 0, 0, 0.16)',
        borderRadius: '0px 4px 4px 0px'
      }}
      className="flex flex-col items-center justify-center relative"
    >
      <div className="absolute top-0 left-0 pt-2.5 pr-3" style={{ width: '411px' }}>
        <CloseIcon className="cursor-pointer float-right w-6.25 h-6.25" onClick={onClose} />
      </div>
      <img className="w-22 h-22" src={Avatar} alt="avatar" />
      <h1 className="font-semibold text-success text-base my-7">Import from a DID link</h1>

      <input
        style={{ width: '238px', height: '25px' }}
        className={clsx(
          clicked && 'cursor-wait',
          'focus:outline-none bg-trueGray-100 bg-opacity-10 text-center text-white text-sm placeholder-trueGray-400 border-b border-white'
        )}
        placeholder="Insert a DID link here"
        value={didLink}
        onChange={(e) => {
          setDidLink(e.target.value)
          setInvalidDIDLink(false)
        }}
        disabled={clicked}
      />
      {invalidDIDLink && (
        <span className="mt-2 text-center font-normal text-xs leading-4 text-warning-300 tracking-finnieSpacing-wide">
          That’s not a valid DID link
        </span>
      )}
      <button
        className={clsx(
          clicked ? 'cursor-wait' : 'cursor-pointer',
          isEmpty(didLink) && !clicked && 'cursor-not-allowed',
          'rounded-sm shadow-md text-center text-indigo bg-success text-sm mt-6.25'
        )}
        style={{ width: '200px', height: '38px' }}
        onClick={() => handleImportDID()}
        disabled={clicked || isEmpty(didLink)}
      >
        Import
      </button>
    </div>
  )
}

export default ImportFromDID
