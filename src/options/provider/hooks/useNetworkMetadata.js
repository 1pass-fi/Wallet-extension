import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TYPE } from 'constants/accountConstants'
import get from 'lodash/get'
import { setNetworkMetadata } from 'options/actions/networkMetadata'
import { getDisplayingAccount } from 'options/selectors/displayingAccount'
import { getEthNetworkMetadata } from 'services/getNetworkMetadata'

const useNetworkMetadata = () => {
  const dispatch = useDispatch()
  const displayingAccount = useSelector(getDisplayingAccount)
  const currentProvider = useSelector(state => state.currentProvider)

  useEffect(() => {
    const loadNetworkMetadata = async () => {
      try {
        if (get(displayingAccount, 'type') === TYPE.ETHEREUM) {
          const metadata = await getEthNetworkMetadata(currentProvider)
          if (metadata) {
            dispatch(setNetworkMetadata(metadata))
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (displayingAccount && currentProvider) loadNetworkMetadata()
  }, [displayingAccount, currentProvider])
}

export default useNetworkMetadata
