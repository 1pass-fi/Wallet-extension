import { useEffect, useState } from 'react'
import { get, isArray } from 'lodash'
import { popupAccount } from 'services/account'

const useAccountList = () => {
  const [accountList, setAccountList] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        let accounts = await popupAccount.getAllMetadata()
        if (!isArray(accounts)) {
          accounts = []
        }
        accounts = accounts.map((account, index) => ({
          id: index,
          value: get(account, 'address'),
          label: get(account, 'accountName'),
          address: get(account, 'address'),
          type: get(account, 'type')
        }))
        setAccountList(accounts)
      } catch (error) {
        console.log(error.message)
      }
    }

    load()
  }, [])

  return { accountList }
}

export default useAccountList
