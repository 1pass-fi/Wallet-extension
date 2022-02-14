import React from 'react'

import ArrowIcon from 'img/down-arrow-icon.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'

const Account = ({ showAccountDropdown, setShowAccountDropdown }) => {
  return (
    <div
      className="bg-blue-800 flex items-center justify-between cursor-pointer"
      style={{ width: '249px', height: '100%' }}
      onClick={() => {
        setShowAccountDropdown((prev) => !prev)
      }}
    >
      <div className="ml-2.5 flex items-center">
        <FinnieIcon style={{ width: '25px', height: '25px' }} />
        <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
          NODE ACCOUNT 1
        </div>
      </div>
      <ArrowIcon
        className="mr-6.5"
        style={{ transform: !showAccountDropdown ? 'none' : 'rotateX(180deg)' }}
      />
    </div>
  )
}

export default Account
