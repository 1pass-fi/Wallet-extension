import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Modal from 'popup/components/shared/modal'
import Button from 'popup/components/shared/button'
import InputField from 'popup/components/shared/inputField'

import './index.css'

const propTypes = {
  currentName: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

const EditAccountNameModal = ({
  currentName,
  onClose,
  onSubmit,
}) => {
  const [accountName, setAccountName] = useState(currentName)
  
  const onChangeAccountName = (e) => {
    setAccountName(e.target.value)
  }

  return (
    <Modal onClose={onClose} className='edit-account-name-modal'>
      <div className='modal-title'>Change Account Name</div>
      <InputField 
        type='text'
        className='account-name-input'
        value={accountName}
        onChange={onChangeAccountName}
      />
      <div className="modal-action-buttons">
        <Button
          onClick={() => {onSubmit(accountName)}}
          label='Done'
          className="modal-action-button send"
        />
        <Button
          onClick={onClose}
          type="outline"
          label="Cancel"
          className="modal-action-button close"
        />
      </div>
    </Modal>
  )
}

EditAccountNameModal.propTypes = propTypes

export default EditAccountNameModal
