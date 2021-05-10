import React, { useContext } from 'react'

import DropFile from 'shared/dropFile'
import Card from 'shared/card'
import CreatePassword from 'shared/createPassword'
import ExportIcon from 'img/export-icon.svg'
import KoiContext from 'popup/context'

import './index.css'

export default () => {
  const { handleImportWallet } = useContext(KoiContext)
  return (
    <div className="account-import-key">
      <Card className="import-card">
        <div className="title">
          <ExportIcon className="title-icon" />
          <div className="title-text">Upload a .JSON file</div>
        </div>
        <form onSubmit={handleImportWallet}>
          <DropFile />
          <CreatePassword />
        </form>
      </Card>
    </div>
  )
}
