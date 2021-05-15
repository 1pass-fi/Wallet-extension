import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { get } from 'lodash'

import DropFile from 'shared/dropFile'
import Card from 'shared/card'
import CreatePassword from 'shared/createPassword'
import ExportIcon from 'img/export-icon.svg'

import { importWallet } from 'actions/koi'
import { setError } from 'actions/error'

import { JSONFileToObject } from 'utils'
import { PATH, ERROR_MESSAGE } from 'constants'

import './index.css'


export const ImportByFile = ({ setError, importWallet }) => {
  const history = useHistory()
  const [file, setFile] = useState({})
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!e.target.files) {
        e.target.files = [file]
      }
      const password = get(e, 'target.pwd.value')
      const passwordConfirm = get(e, 'target.pwdConfirm.value')
      const checked = get(e, 'target.checkbox.checked')

      if (password.length < 8) {
        setError(ERROR_MESSAGE.PASSWORD_LENGTH)
      } else if (password !== passwordConfirm) {
        setError(ERROR_MESSAGE.PASSWORD_MATCH)
      } else if (!checked) {
        setError(ERROR_MESSAGE.CHECKED_TERMS)
      } else {
        const fileData = await JSONFileToObject(file)
        const redirectPath = PATH.IMPORT_KEY_REDIRECT
        importWallet({ data: fileData, password, history, redirectPath })
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

export default connect(null, { setError, importWallet })(ImportByFile)
