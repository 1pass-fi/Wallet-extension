# Finnie Chrome Extension

You can find the latest version of Finnie wallet on [Chrome Store](https://chrome.google.com/webstore/detail/finnie/cjmkndjhnagcfbpiemnkdpomccnjblmj)

Finnie supports Google Chrome, we will support Firefox and Chromium-based browsers in the near future

## How to build locally
- Install [Nodejs](https://nodejs.org/en/) version 16
- Install [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)
- Start locally
    - Run `yarn start:chrome` to start the dev-server and have Finnie installed in new Chrome instance
- Build locally
    - Run `yarn build`
    - Find package at `./extension`

## Integrate Finnie to your DApps
### Arweave
- Connect
```
type WalletAddress = String
window.arweaveWallet.connect(): Promise<WalletAddress[]>
```
- Get Address
```
type WalletAddress = String
window.arweaveWallet.getAddress(): Promise<WalletAddress>
```
- Disconnect
```
window.arweaveWallet.disconnect(): Promise<void>
```
- Sign transaction
```
const transaction = await arweave.createTransaction()
window.arweaveWallet.sign(transaction): Promise<void>
```
or
```
const transaction = await arweave.createTransaction()
arweave.transaction.sign(transaction): Promise<void>
```
### Ethereum
- Connect
```
type WalletAddress = String
window.ethereum.request({ method: 'requestAccounts' }): Promise<WalletAddress[]>
```
- Sign and send transaction
```
type WalletAddress = String

type TransactionHash = String

interface Transaction {
    gasPrice?: string,
    gas?: string,
    to: WalletAddress,
    from: WalletAddress,
    value?: string,
    data?: string
}

window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transaction: Transaction]
}): Promise<TransactionHash>

```
- Sign typed data
### Solana
- Connect
```
window.solana.connect(): Promise<PublicKey>
```
- Disconnect
```
window.solana.disconnect(): Promise<void>
```
- Sign and send transaction
```
type TransactionHash = String

const transaction = new Transaction()
window.solana.signAndSendTransaction(transaction): Promise<TransactionHash>
```
- Sign transaction without sending
```
const transaction = new Transaction()
window.solana.signTransaction(): Promise<void>
```
- Sign message
```
interface SignMessageResponse {
    publicKey: PublicKey,
    signature: Uint8Array
}

const message = 'example message'
window.solana.signMessage(message): Promise<SignMessageResponse>
```
