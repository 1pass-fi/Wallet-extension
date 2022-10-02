import { useEffect, useState } from 'react'
import axios from 'axios'
import { get, isEmpty } from 'lodash'

/* 
  Hard return null -> temporary disable security function
  since sunrise services has been down
  Looking for an substitute vendor
*/

const useSecurityStatus = ({ setIsLoading, url }) => {
  const [trustStat, setTrustStat] = useState(null)

  const getTrustStat = async () => {
    try {
      setIsLoading(true)
      setTrustStat(null)
      if (isEmpty(url)) {
        return
      }
      const { data } = await axios.get(`https://api.sunrise.wtf/api/v1/status?url=${url}`)
      console.log('getTrustStat ', url, data)
      setTrustStat(get(data, 'status.trust_score'))
    } catch (error) {
      console.log('Failed to get Trust stat for ', url, '. Error: ', error)
      setTrustStat(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // getTrustStat()
  }, [url])

  return { trustStat }
}

export default useSecurityStatus
