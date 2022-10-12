import axiosAdapter from '@vespaiach/axios-fetch-adapter'
import axios from 'axios'

export default async (txId) => {
  const BASE_URL = 'https://api.koii.live/generateDID'
  return axios.request({
    url: `${BASE_URL}/${txId}`,
    adapter: axiosAdapter
  })
}
