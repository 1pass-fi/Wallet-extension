import axios from 'axios'

export default async (kID) => {
  const BASE_URL = 'https://api.koii.live/generateCard'
  return axios.get(`${BASE_URL}/${kID}`)
}
