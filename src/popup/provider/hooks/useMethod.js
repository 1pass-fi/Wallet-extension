import { PATH } from 'constants/koiConstants'

const useMethod = ({ accounts }) => {
  const handleLockWallet = async () => {
    if (!isEmpty(accounts)) {
      setIsLoading(true)
      await lockWallet()
      setIsLoading(false)

      history.push(PATH.LOGIN)

      chrome.tabs.query({ url: chrome.extension.getURL('*') }, (tabs) => {
        tabs.map((tab) => chrome.tabs.reload(tab.id))
      })
    } else {
      setError('Cannot lock wallet.')
    }
  }

  return { handleLockWallet }
}

export default useMethod
