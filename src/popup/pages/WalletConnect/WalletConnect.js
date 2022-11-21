import React, { useState } from 'react'

import Approval from './Approval'
import InputUri from './InputUri'

const INPUT_URI = 'INPUT_URI'
const APPROVAL = 'APPROVAL'

const WalletConnect = () => {
  const [page, setPage] = useState(INPUT_URI)
  const [proposal, setProposal] = useState({})

  return (
    <div className='w-full h-full'>
      {page === INPUT_URI && <InputUri setPage={setPage} setProposal={setProposal}/>}
      {page === APPROVAL && <Approval proposal={proposal}/>}
    </div>
  )
}

export default WalletConnect
