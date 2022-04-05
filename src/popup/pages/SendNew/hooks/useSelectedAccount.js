import { useState, useMemo } from 'react'

const useSelectedAccount = () => {
  const [selectedAccount, setSelectedAccount] = useState(null)

  const selectedNetwork = useMemo(() => {
    return get(selectedAccount, 'type')
  }, [selectedAccount])

  return { selectedNetwork, selectedAccount, setSelectedAccount} 
}

export default useSelectedAccount
