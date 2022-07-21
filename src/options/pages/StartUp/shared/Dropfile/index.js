import React, { useEffect, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'

import ExportIcon from 'img/startup/json-keyfile.svg'

import './index.css'
import { GalleryContext } from 'options/galleryContext'

import { popupAccount } from 'services/account'
import storage from 'services/storage'
import { setDefaultAccount } from 'options/actions/defaultAccount'
import { setActivatedAccountAddress } from 'utils'

const DragActive = ({ description, Icon }) => {
  return (
    <div className='drag-active'>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }} className='export-icon'>
        {Icon ? <Icon /> : <ExportIcon />}
      </div>
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

  const { importedAddress } = useContext(GalleryContext)

  const dispatch = useDispatch()

  useEffect(() => {
    setFile(acceptedFiles ? acceptedFiles[0] : {})

    const handleSetDefaultAccount = async () => {
      const account = await popupAccount.getAccount({ address: importedAddress })
      const data = await account.get.metadata()
      await setActivatedAccountAddress(data.address, data.type)
      dispatch(setDefaultAccount(data))
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
