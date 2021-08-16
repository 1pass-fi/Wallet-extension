import crypto from 'crypto'

/**
 *
 * @param {String} trxId - The Transaction Id of the NFT to generate Port
 */ 
export default async(trxId, koi) => {
  let headers = await generatePoRTHeaders(trxId, koi)
  return headers
  // headers['x-request-signature'] = JSON.parse(headers['x-request-signature']);
}
/**
 * @description This method Will return signed header and public header for KOI attention traffic
 * @param {string} resoureId -   The resourse Id will be TrxId of the resource
 */
async function generatePoRTHeaders(payload, koi) {
  let headers = {}
  try {
    let signPayload = await proofOfWork({
      data: {
        payload,
        timeStamp: Math.floor(+new Date() / 1000),
      },
    }, koi)
    headers['x-request-signature'] = JSON.stringify({
      data: signPayload['data'],
      signature: signPayload['signature'],
    })
    headers['request-public-key'] = signPayload.owner
    return headers
  } catch (e) {
    console.log(e)
    throw new {
      name: 'Generic Error',
      description: 'Something went wrong while generating headers',
    }()
  }
}

async function proofOfWork(payload, koi) {
  let nonce = 0
  const loopCondition = true
  let signedPayload = {}
  while (loopCondition) {
    payload.data.nonce = nonce
    signedPayload = await koi.signPayload(payload)
    let e = crypto
      .createHash('sha256')
      .update(JSON.stringify(signedPayload.signature))
      .digest('hex')
    if (difficultyFunction(e)) {
      console.log(e)
      break
    }
    nonce++
  }
  return signedPayload
}
function difficultyFunction(hash) {
  return hash.startsWith('00') || hash.startsWith('01')
}
