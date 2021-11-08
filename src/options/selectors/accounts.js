import { TYPE } from 'constants/accountConstants'

export const getArAccounts = (state) =>
  state.accounts.filter((account) => account.type === TYPE.ARWEAVE)
