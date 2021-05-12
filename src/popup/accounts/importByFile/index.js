import React, { useContext, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import DropFile from 'shared/dropFile'
import Card from 'shared/card'
import CreatePassword from 'shared/createPassword'
import ExportIcon from 'img/export-icon.svg'
import KoiContext from 'popup/context'

import './index.css'

export default () => {
  const [file, setFile] = useState({})
  const { handleImportWallet, setError } = useContext(KoiContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      if (!e.target.files) {
        e.target.files = [file]
      }
      const password = e.target.pwd.value
      const passwordConfirm = e.target.pwdConfirm.value
      const checked = e.target.checkbox.checked

      if (password.length < 8) {
        setError('Password must contain at least 8 characters')
      } else if (password !== passwordConfirm) {
        setError('Confirm Password does not match')
      } else if (!checked) {
        setError('You have to agree to the Terms of Service')
      } else {
        handleImportWallet(e)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="account-import-key">
      <Card className="import-card">
        <div className="title">
          <ExportIcon className="title-icon" />
          <div className="title-text">Upload a .JSON file</div>
        </div>
        <form onSubmit={handleSubmit}>
          <DropFile file={file} setFile={setFile} />
          <CreatePassword isEnable={!isEmpty(file)} />
        </form>
      </Card>
    </div>
  )
}
