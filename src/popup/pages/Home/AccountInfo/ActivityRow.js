import clsx from 'clsx'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { get, includes } from 'lodash'

import { PATH, ETH_NETWORK_PROVIDER, URL } from 'constants/koiConstants'
import { transactionAmountFormat } from 'utils'

import ViewBlockIcon from 'img/v2/view-block.svg'
import GreenDotIcon from 'img/v2/green-dot.svg'

import formatLongString from 'options/finnie-v2/utils/formatLongString'

const ActivityRow = ({
  activityName,
  expense,
  date,
  source,
  id,
  pending,
  price,
  currency,
  accountName,
  expired,
  network,
  seen,
  setDeleteTransactionModalStatus
}) => {
  const [displayInfo, setDisplayInfo] = useState({})
  const [loaded, setLoaded] = useState(false)

  const dateFormat = (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }

  useEffect(() => {
    const loadDisplayData = async () => {
      try {
        let info = {}
        let recipientOrSender
        let fromToAddress,
          blockButtonText,
          pendingOrExpired,
          expenseText,
          toUsdText,
          dateString,
          blockUrl

        recipientOrSender = source
          ? `${source.slice(0, 4)}...${source.slice(source.length - 5)}`
          : ''

        if (includes(activityName, 'Received')) {
          fromToAddress = `from ${recipientOrSender}`
        }

        if (includes(activityName, 'Sent')) {
          fromToAddress = `to ${recipientOrSender}`
        }

        blockButtonText = pending ? 'explore block' : 'view block'
        if (network) blockButtonText = 'etherscan'

        pendingOrExpired = expired ? 'Transaction failed' : 'Transaction pending'

        if (!network) {
          blockUrl = `${PATH.VIEW_BLOCK_TRANSACTION}/${id}`
        } else {
          if (network === ETH_NETWORK_PROVIDER.MAINNET)
            blockUrl = `${URL.ETHERSCAN_MAINNET}/tx/${id}`
          if (network === ETH_NETWORK_PROVIDER.RINKEBY)
            blockUrl = `${URL.ETHERSCAN_RINKEBY}/tx/${id}`
        }

        if (!includes(activityName, 'Bridge')) {
          let sign = includes(activityName, 'Received') ? '+' : '-'
          let token = includes(activityName, 'KOII') ? 'KOII' : 'AR'
          if (includes(activityName, 'ETH')) token = 'ETH'

          expenseText = `${expense !== null && expense > 0 ? sign : ''}${transactionAmountFormat(
            expense
          )} ${token}`

          toUsdText = `${transactionAmountFormat(expense * price[token])} ${currency}`
        } else {
          expenseText = ''
          toUsdText = ''
        }

        dateString = dateFormat(date)

        info = {
          fromToAddress,
          blockButtonText,
          pendingOrExpired,
          expenseText,
          toUsdText,
          dateString,
          blockUrl
        }
        setDisplayInfo(info)
        setLoaded(true)
      } catch (err) {
        console.log('Load activity info error: ', err.message)
      }
    }

    loadDisplayData()
  }, [expired])

  return (
    <div>
      {loaded && (
        <div
          className={clsx(
            'flex justify-between px-4.25 pl-5 h-18.25 border-b-2 border-gray-underline',
            !seen && 'font-semibold'
          )}
        >
          <div className="w-full flex flex-col relative pt-2">
            {!seen && (
              <div className="absolute -left-4.25 top-3.25">
                <GreenDotIcon />
              </div>
            )}
            <div className="text-sm font-semibold text-blue-800 leading-5">
              {activityName.length <= 21 ? activityName : `${activityName.substring(0, 19)}...`}
            </div>
            {(activityName.includes('Received') || activityName.includes('Sent')) && (
              <div className="text-xs text-blue-800">
                {activityName.includes('Sent') ? 'to' : 'from'}{' '}
                <span className="text-success-700">{formatLongString(source, 10)}</span>
              </div>
            )}
            <div className="text-xs font-semibold text-blue-800 leading-5">{accountName}</div>
          </div>
          <div className="w-full flex flex-col items-end text-right pt-2">
            <div
              className={`text-sm font-semibold rounded-sm px-1 text-blue-800 ${
                get(displayInfo, 'expenseText').includes('-') ? 'bg-warning' : 'bg-success'
              } ${!seen && 'bg-opacity-50'} leading-5`}
            >
              {get(displayInfo, 'expenseText')}
            </div>
            <div className="text-xs text-success-700">{get(displayInfo, 'dateString')}</div>
            {!expired ? (
              <a
                href={displayInfo.blockUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-end text-xs text-success-700 underline leading-5"
              >
                <div className="pr-1.375">
                  <ViewBlockIcon />
                </div>
                {!pending ? 'Explore Block' : 'Pending transaction'}
              </a>
            ) : (
              <div
                onClick={() => {
                  setDeleteTransactionModalStatus({
                    isShow: true,
                    txInfo: {
                      txId: id,
                      address: source
                    }
                  })
                }}
                className="text-xs text-red-finnie underline leading-5 cursor-pointer"
              >
                Transaction failed
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityRow
