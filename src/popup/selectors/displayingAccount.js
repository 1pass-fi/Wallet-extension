import { TYPE } from 'constants/accountConstants'

export const getDisplayingAccount = (state) => {
  const { defaultAccount, activatedChain } = state

  if (activatedChain === TYPE.ARWEAVE) {
    return defaultAccount.AR
  } else if (activatedChain === TYPE.ETHEREUM) {
    return defaultAccount.ETH
  }
}