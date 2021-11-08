import { backgroundAccount } from 'services/account'
/* 
  This function will be used to initiate pending transaction object
*/

import moment from 'moment'

export default async ({
  id,
  activityName,
  expense,
  target,
  address,
  network,
  retried
}) => {
  const credentials = await backgroundAccount.getCredentialByAddress(address)
  const account = await backgroundAccount.getAccount(credentials)

  const pendingTransactions = await account.get.pendingTransactions() || []
  const accountName = await account.get.accountName()

  const initialTransaction = {
    id,
    activityName,
    expense,
    accountName,
    date: moment().format('MMMM DD YYYY'),
    source: target,
    senderAddress: target,
    retried,
    network
  }

  pendingTransactions.push(initialTransaction)
  await account.set.pendingTransactions(pendingTransactions)
}
