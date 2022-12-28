import approveWalletConnect from './approveWalletConnect'
import bridgeNft from './bridgeNft'
import changeAccountName from './changeAccountName'
import connect from './connect'
import createCollection from './createCollection'
import createDID from './createDID'
import createUpdateDID from './createUpdateDID'
import friendReferral from './friendReferral'
import generateWallet from './generateWallet'
import getBalance from './getBalance'
import getDID from './getDID'
import getDIDData from './getDIDData'
import getKey from './getKey'
import getKeyFile from './getKeyFile'
import getLockState from './getLockState'
import handleExpiredTransaction from './handleExpiredTransaction'
import importWallet from './importWallet'
import loadActivity from './loadActivity'
import loadBalanceAsync from './loadBalanceAsync'
import loadCollection from './loadCollection'
import loadContent from './loadContent'
import loadDID from './loadDID'
import loadFriendReferralData from './loadFriendReferralData'
import lockWallet from './lockWallet'
import makeTransfer from './makeTransfer'
import pairingWalletConnect from './pairingWalletConnect'
import rejectWalletConnect from './rejectWalletConnect'
import removeWallet from './removeWallet'
import saveNewWallet from './saveNewWallet'
import sendCustomTokenAr from './sendCustomTokenAr'
import sendCustomTokenEth from './sendCustomTokenEth'
import sendCustomTokenK2 from './sendCustomTokenK2'
import sendCustomTokenSol from './sendCustomTokenSol'
import sendNft from './sendNft'
import setDefaultAccount from './setDefaultAccount'
import signTransaction from './signTransaction'
import unlockWallet from './unlockWallet'
import updateCollection from './updateCollection'
import updateDID from './updateDID'
import updateEthereumProvider from './updateEthereumProvider'
import updateK2Provider from './updateK2Provider'
import updateNft from './updateNft'
import updatePassword from './updatePassword'
import updateSolanaProvider from './updateSolanaProvider'
import uploadNft from './uploadNft'
import verifyPassword from './verifyPassword'

export default {
  getBalance,
  importWallet,
  removeWallet,
  lockWallet,
  unlockWallet,
  generateWallet,
  saveNewWallet,
  loadContent,
  loadActivity,
  makeTransfer,
  getKeyFile,
  connect,
  signTransaction,
  uploadNft,
  createCollection,
  createUpdateDID,
  changeAccountName,
  getLockState,
  loadCollection,
  loadDID,
  setDefaultAccount,
  friendReferral,
  bridgeNft,
  sendNft,
  handleExpiredTransaction,
  loadFriendReferralData,
  createDID,
  updateDID,
  getDID,
  getDIDData,
  updateCollection,
  getKey,
  updatePassword,
  updateNft,
  loadBalanceAsync,
  updateEthereumProvider,
  updateSolanaProvider,
  updateK2Provider,
  sendCustomTokenEth,
  sendCustomTokenAr,
  sendCustomTokenSol,
  sendCustomTokenK2,
  verifyPassword,
  pairingWalletConnect,
  approveWalletConnect,
  rejectWalletConnect
}
