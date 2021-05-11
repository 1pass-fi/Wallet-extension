import React, { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'

import ExportIcon from 'img/export-icon-sm.svg'

import './index.css'

const DragActive = ({ description }) => {
  return (
    <div className='drag-active'>
      <ExportIcon className='export-icon' />
      <div className='import-description'>
        {description ||
          'Drag & drop an existing .JSON wallet file here or click to browse your computer'}
      </div>
    </div>
  )
}

export default ({ file, setFile }) => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    accept: 'application/json',
  })

  useEffect(() => {
    setFile(acceptedFiles ? acceptedFiles[0] : {})
  }, [acceptedFiles])

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <div className='decorator'>
        <input name='fileField' data-testid='fileInput' {...getInputProps()} />
        {isDragAccept && <DragActive description={'Drop to import file.'} />}
        {isDragReject && <DragActive description={'Invalid file.'} />}
        {!isDragActive && (
          <DragActive description={!isEmpty(file) ? file.name : ''} />
        )}
      </div>
    </div>
  )
}
