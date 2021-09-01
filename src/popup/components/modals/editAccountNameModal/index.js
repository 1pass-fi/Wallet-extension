// modules
import React, {useState} from 'react'
import PropTypes from 'prop-types'

// components
import Modal from 'popup/components/shared/modal'
import Button from 'popup/components/shared/button'
import InputField from 'popup/components/shared/inputField'

// styles
import './index.css'

const propTypes = {
  accunt: PropTypes.shape({
    accountName: PropTypes.string,
    address: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

const EditAccountNameModal = ({
  onClose,
  onSubmit,
  account
}) => {
  const [accountName, setAccountName] = useState(account.accountName)
  
  const onChangeAccountName = (e) => {
    setAccountName(e.target.value)
  }

  return (
    <Modal onClose={onClose} className='edit-account-name-modal'>
      <div className='modal-title'>Change Account Name</div>
      <InputField 
        type='text'
        className='account-name-input'
        value={account.accountName}
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
