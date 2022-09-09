import { TYPE } from 'constants/accountConstants'

export const getDisplayingAccount = (state) => {
  const { defaultAccount, activatedChain } = state
  if (activatedChain === TYPE.ARWEAVE) return defaultAccount.AR
  if (activatedChain === TYPE.ETHEREUM) return defaultAccount.ETH
  if (activatedChain === TYPE.SOLANA) return defaultAccount.SOL
  if (activatedChain === TYPE.K2) return defaultAccount.K2
}
