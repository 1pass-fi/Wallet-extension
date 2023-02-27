// modules
import React from 'react'
import BulletPoint from 'img/popup/bullet-point.svg'
// components
import Checkbox from 'popup/components/shared/checkBoxRedesign'

const AllowPermission = ({ handleOnClick }) => {
  return (
    <div className="mt-7.5">
      <div className="mb-6.25 font-semibold text-base leading-5 text-center tracking-finnieSpacing-wide text-indigo">
        {chrome.i18n.getMessage('allowThisSiteTo')}:
      </div>
      <div className="flex w-full items-start px-9.75 font-normal text-sm tracking-finnieSpacing-wide text-indigo">
        <BulletPoint className="w-2 h-2 mr-4 mt-1.25" />
        {chrome.i18n.getMessage('viewTheAddressesPermission')}
      </div>
      <div className="flex w-full items-start px-9.75 font-normal text-sm tracking-finnieSpacing-wide text-indigo mt-2">
        <BulletPoint className="w-2 h-2 mr-4 mt-1.25" />
        {chrome.i18n.getMessage('seeAccountBalancePermission')}
      </div>
      <div className="flex w-full items-start px-9.75 font-normal text-sm tracking-finnieSpacing-wide text-indigo mt-2">
        <BulletPoint className="w-2 h-2 mr-4 mt-1.25" />
        {chrome.i18n.getMessage('suggestTransactionPermission')}
      </div>
    </div>
  )
}

export default AllowPermission
