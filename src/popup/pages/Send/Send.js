import React from 'react'

import { useHistory } from 'react-router-dom'

import SendBackgroundLeft from 'img/popup/send-background-left.svg'
import SendBackgroundRight from 'img/popup/send-background-right.svg'
import BackBtn from 'img/popup/back-button.svg'

const Send = () => {
  const history = useHistory()

  return (
    <div className="w-full relative bg-white flex flex-col items-center pt-9.75">
      <SendBackgroundLeft className="absolute top-0 left-0" />
      <SendBackgroundRight className="absolute top-0 right-0" />
      <BackBtn
        onClick={() => history.goBack()}
        className="w-8.75 h-8.75 z-20 absolute top-3.25 left-3.75 cursor-pointer bg-white bg-opacity-70 rounded-full"
      />
    </div>
  )
}

export default Send
