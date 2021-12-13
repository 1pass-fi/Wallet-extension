import errorHandler from '../../errorHandler'

const resendAr = async (account, transaction) => {
  const target = transaction?.source
  const qty = transaction?.expense
  if (!target || !qty) throw new Error('Invalid transaction input')
  return await account.method.transfer('AR', target, qty)
}

export default errorHandler(resendAr)
