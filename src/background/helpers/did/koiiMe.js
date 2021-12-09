import axios from 'axios'

import { BRANDLY_API_KEY } from 'constants/koiConstants'

export const mapKoiiMe = async ({ txId, kID }) => {
  const available = await checkAvailable(kID)
  if (!available) throw new Error('This kID is not available')

  const url = 'https://api.rebrandly.com/v1/links'

  const destination = `https://arweave.net/${txId}`
  const slashtag = `u/${kID}`
  const domain = { fullName: 'koii.me' }

  const linkRequest = {
    destination,
    domain,
    slashtag
  }

  const requestHeaders = {
    'ContentType': 'application/json',
    'apiKey': BRANDLY_API_KEY
  }

  try {
    const { status } = await axios({
      method: 'POST',
      url,
      headers: requestHeaders,
      data: linkRequest
    })

    return status === 200
  } catch (err) {
    console.log(err.errors)
    return false
  }

}

export const checkAvailable = async (kID) => {
  try {
    const url = `https://koii.me/u/${kID}`
    const { data } = await axios.get(url)
  
    return data.includes('<h1>The link you clicked has been <br>deleted or suspended</h1>')

  } catch (err) {
    console.error(err.message)
    return false
  }
}

export default {
  mapKoiiMe,
  checkAvailable
}
