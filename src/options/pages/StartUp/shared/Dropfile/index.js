import React, { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'

import ExportIcon from 'img/startup/json-keyfile.svg'

import './index.css'

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

  useEffect(() => {
    setFile(acceptedFiles ? acceptedFiles[0] : {})
  }, [acceptedFiles])

  return (
    <div {...getRootProps({ className: `dropzone ${className}` })}>
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
