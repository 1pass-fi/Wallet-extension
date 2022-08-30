import { useMemo,useState } from 'react'
import { get } from 'lodash'

const useSelectedAccount = ({ selectedAccount }) => {
  const selectedNetwork = useMemo(() => {
    return get(selectedAccount, 'type')
  }, [selectedAccount])

  return { selectedNetwork }
}

export default useSelectedAccount
