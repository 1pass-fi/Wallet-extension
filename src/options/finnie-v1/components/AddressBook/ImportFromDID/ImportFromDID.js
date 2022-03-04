import React from 'react'

import CloseIcon from 'img/ab-close-icon.svg'
import Avatar from 'img/ab-avatar.png'

const ImportFromDID = ({ onClose }) => {
  return (
    <div
      style={{
        width: '411px',
        height: '486px',
        backgroundColor: '#3E3E71',
        'box-shadow': 'inset 8px 0 10px -6px rgba(0, 0, 0, 0.16)',
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
        className="focus:outline-none bg-trueGray-100 bg-opacity-10 text-center text-white text-sm placeholder-trueGray-400 border-b border-white"
        placeholder="Insert a DID link here"
      />
      <button
        className="rounded-sm shadow-md text-center text-indigo bg-success text-sm mt-6.25"
        style={{ width: '200px', height: '38px' }}
      >
        Import
      </button>
    </div>
  )
}

export default ImportFromDID
