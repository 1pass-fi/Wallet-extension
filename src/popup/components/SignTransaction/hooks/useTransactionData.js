import { useEffect, useState } from 'react'
import { isArray, isString } from 'lodash'

const useTransactionData = ({ transactionPayload }) => {
  const [stringData, setStringData] = useState(null)
  const [dataSize, setDataSize] = useState(0)

  useEffect(() => {
    const load = () => {
      const data = get(transactionPayload, 'data')
      if (data) {
        if (isArray(data)) {
          const buf = Buffer.from(data)
          const base64String = buf.toString('base64')
          setDataSize(buf.byteLength)
          setStringData(base64String)
        }
        if (isString(data)) {
          const buf = Buffer.from(data, 'hex')
          setDataSize(buf.byteLength)
          setStringData(data)
        }
      }
    }

    if (transactionPayload) load()
  }, [transactionPayload])

  return { stringData, dataSize }
}

export default useTransactionData
