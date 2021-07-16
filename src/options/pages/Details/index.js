import React from 'react'
import { useParams } from 'react-router'
import Content from 'options/components/content'

export default () => {
  const { txid } = useParams()
  return <Content choosenTxid={txid} detail={true}/>
}
