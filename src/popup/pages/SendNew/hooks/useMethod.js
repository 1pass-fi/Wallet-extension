

const ETHEREUM = 'ETHEREUM'
const ARWEAVE = 'ARWEAVE'

const validateAddress = (address) => {
  if (address?.slice(0, 2) === '0x' && address?.length === 42) return ETHEREUM
  if (address?.length === 43) return ARWEAVE
}

const toHexString = (data) => {

}

const useMethod = ({ sender, recipient, value, contractAddress }) => {
  const onSendTokens = () => {
    console.log({ sender, recipient, value, contractAddress })
    const network = validateAddress(sender)
    if (!network) throw new Error('Invalid address')

    if (network === 'ETHEREUM') {
      if (contractAddress) {
        // send erc20 token
        console.log('send erc20 token')
      } else {
        // send origin token
        const transactionPayload = {
          from: sender,
          to: recipient,
          value
        }
        console.log('transactionPayload ethereum', transactionPayload)
      }
    }

    if (network === 'ARWEAVE') {
      if (contractAddress) {
        // send custom token
        console.log('send arweave custom token')
      } else {
        // send origin token
        const transactionPayload = {
          from: sender,
          to: recipient,
          value
        }
        console.log('transactionPayload arweave', transactionPayload)
      }
    }
  }

  return { onSendTokens }
}

export default useMethod
