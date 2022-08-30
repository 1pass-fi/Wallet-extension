import { useEffect, useState } from 'react'
import { get } from 'lodash'
import { popupAccount } from 'services/account'

const useAccountList = () => {
  const [accountList, setAccountList] = useState([])

  useEffect(() => {
    const load = async () => {
      let accounts = await popupAccount.getAllMetadata()
      accounts = accounts.map((account, index) => ({
        id: index,
        value: get(account, 'address'),
        label: get(account, 'accountName'),
        address: get(account, 'address'),
        type: get(account, 'type')
      }))

      setAccountList(accounts)
    }

    load()
  }, [])

  return { accountList }
}

export default useAccountList
