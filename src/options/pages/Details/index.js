import React from 'react'
import { useParams } from 'react-router'

export default () => {
  const { txid } = useParams()
  return <div>details {txid}</div>
}
