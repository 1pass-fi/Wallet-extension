import React, { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmpty from 'lodash/isEmpty'

import ClickIcon from 'img/v2/click-icon.svg'

const DragActive = ({ description, Icon }) => {
  return (
    <div className="flex flex-col justify-center items-center text-white">
      {Icon ? <Icon /> : <ClickIcon className="w-8.5 h-10.25" />}

      <div className="w-32 text-center mt-2.75">{description}</div>
    </div>
  )
}

const DropFile = ({
  file,
  setFile,
  fileType = '',
  className = '',
  Icon,
  description = '.JSON key file',
  isCreateCollection,
  setFiles
}) => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    maxFiles: isCreateCollection ? Infinity : 1,
    accept: fileType ? fileType : 'application/json'
  })

  useEffect(() => {
    console.log('accepted files', acceptedFiles)
    if (!isCreateCollection) setFile(acceptedFiles ? acceptedFiles[0] : {})
    else setFiles(acceptedFiles)
  }, [acceptedFiles])

  return (
    <div {...getRootProps({ className: 'dropzone w-full h-full' })}>
      <div className="cursor-pointer h-full flex items-center justify-center">
        <input name="fileField" data-testid="fileInput" {...getInputProps()} />
        {isDragAccept && <DragActive description={'Drop to import file.'} />}
        {isDragReject && <DragActive description={'Invalid file.'} />}
        {!isDragActive && (
          <DragActive Icon={Icon} description={!isEmpty(file) ? file.name : description} />
        )}
      </div>
    </div>
  )
}

export default DropFile
