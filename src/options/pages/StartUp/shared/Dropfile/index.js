import React, { useEffect, useContext, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'

import ExportIcon from 'img/startup/json-keyfile.svg'

import './index.css'
import { GalleryContext } from 'options/galleryContext'

import { popupAccount } from 'services/account'
import storage from 'services/storage'

const DragActive = ({ description, Icon }) => {
  return (
    <div className='drag-active'>
      {Icon ? <Icon /> : <ExportIcon className='export-icon' />}
      <div className='import-description'>{description}</div>
    </div>
  )
}

export default ({
  file,
  setFile,
  fileType = '',
  className = '',
  Icon,
  description = '.JSON key file',
  type
}) => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: fileType ? fileType : 'application/json',
  })

  const { importedAddress, setAccount } = useContext(GalleryContext)

  useEffect(() => {
    setFile(acceptedFiles ? acceptedFiles[0] : {})

    const handleSetDefaultAccount = async () => {
      await storage.setting.set.activatedAccountAddress(importedAddress)
      const account = await popupAccount.getAccount({ address: importedAddress })
      const data = await account.get.metadata()
      setAccount(data)
    }

    if (!isEmpty(acceptedFiles) && type == 'image') handleSetDefaultAccount()
  }, [acceptedFiles])

  return (
    <div {...getRootProps({ className: `dropzone-startup ${className}` })}>
      <div className='decorator'>
        <input name='fileField' data-testid='fileInput' {...getInputProps()} />
        {isDragAccept && <DragActive description={'Drop to import file.'} />}
        {isDragReject && <DragActive description={'Invalid file.'} />}
        {!isDragActive && (
          <DragActive
            Icon={Icon}
            description={!isEmpty(file) ? file.name : description}
          />
        )}
      </div>
    </div>
  )
}
