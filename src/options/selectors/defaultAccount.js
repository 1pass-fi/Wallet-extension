export const getBalance = (state) => {
  const { defaultAccount } = state
  return [defaultAccount.balance, defaultAccount.koiBalance]
}
