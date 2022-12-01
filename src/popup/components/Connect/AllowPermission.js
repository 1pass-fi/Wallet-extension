// modules
import React from 'react'
// components
import Checkbox from 'popup/components/shared/checkBoxRedesign'

const AllowPermission = ({ handleOnClick }) => {
  return (
    <div className="mt-7.5">
      <div className="mb-6.25 font-semibold text-base leading-5 text-center tracking-finnieSpacing-wide text-indigo">
        Allow this site to:
      </div>
      <div className="flex px-9.75">
        <Checkbox
          className="check-allow"
          defaultChecked={true}
          isDisabled={true}
          greenBackround={false}
          onChange={(e) => {}}
          label="View the addresses of your permitted accounts"
          isNewDesign={true}
        />
      </div>
      <div className="flex px-9.75 mt-2">
        <Checkbox
          className="check-allow"
          defaultChecked={true}
          isDisabled={true}
          greenBackround={false}
          onChange={(e) => {}}
          label="See account balance"
          isNewDesign={true}
        />
      </div>
      <div className="flex px-9.75 mt-2">
        <Checkbox
          className="check-allow"
          defaultChecked={true}
          isDisabled={true}
          greenBackround={false}
          onChange={(e) => {}}
          label="Suggest transactions to approve"
          isNewDesign={true}
        />
      </div>
    </div>
  )
}

export default AllowPermission
