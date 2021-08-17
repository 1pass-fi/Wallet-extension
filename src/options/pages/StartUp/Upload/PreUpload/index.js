import React from 'react'
import isEmpty from 'lodash/isEmpty'

import Dropfile from '../../shared/Dropfile'

export default ({ file, setFile, nextStep }) => {
  return (
    <div className='upload-file'>
      <div className='title'>Import a key with a .JSON file</div>
      <div className='description'>
        Drag & drop an existing .JSON key file here or click to browse your
        computer.
      </div>
      <Dropfile file={file} setFile={setFile} />
      <button
        disabled={isEmpty(file)}
        onClick={nextStep}
        className='upload-file-button white-button'
      >
        Upload File
      </button>
    </div>
  )
}
