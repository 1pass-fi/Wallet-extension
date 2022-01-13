import axios from 'axios'

export default async (txId) => {
  const BASE_URL = 'https://api.koii.live/generateCard'
  return axios.get(`${BASE_URL}/${txId}`)
}
