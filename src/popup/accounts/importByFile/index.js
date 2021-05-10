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
  const { handleImportWallet } = useContext(KoiContext)
  const handelSubmit = (e) => {
    if (!e.target.files) {
      e.target.files = [file]
    }
    handleImportWallet(e)
  }

  return (
    <div className="account-import-key">
      <Card className="import-card">
        <div className="title">
          <ExportIcon className="title-icon" />
          <div className="title-text">Upload a .JSON file</div>
        </div>
        <form onSubmit={handelSubmit}>
          <DropFile file={file} setFile={setFile} />
          <CreatePassword isEnable={!isEmpty(file)} />
        </form>
      </Card>
    </div>
  )
}
