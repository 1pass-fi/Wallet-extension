import React, { useEffect,useState } from 'react'
import clsx from 'clsx'
import { ACTIVITY_NAME, ETH_NETWORK_PROVIDER, PATH, URL } from 'constants/koiConstants'
import ExploreBlock from 'img/v2/explore-block-coming-soon.svg'
import GreenDotIcon from 'img/v2/green-dot.svg'
import ViewBlockIconNew from 'img/v2/view-block-new.svg'
import { get, includes } from 'lodash'
import moment from 'moment'
import ToolTip from 'options/components/ToolTip'
import formatLongString from 'options/utils/formatLongString'
import { transactionAmountFormat } from 'utils'

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
  setDeleteTransactionModalStatus,
  isK2Account,
  isProcessing
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

        let displayExploreBlock = true

        if (isK2Account) displayExploreBlock = false

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
          if (network === ETH_NETWORK_PROVIDER.GOERLI)
            blockUrl = `${URL.ETHERSCAN_GOERLI}/tx/${id}`
        }

        if (includes(activityName, 'SOL')) {
          blockUrl = `${URL.SOLANA_EXPLORE}/tx/${id}?cluster=${network}`
        }

        if (!includes(activityName, 'Bridge')) {
          let sign = includes(activityName, 'Received') ? '+' : '-'
          // TODO DatH - Handle custom token ETH

          let token = includes(activityName, 'KOII') ? 'KOII' : 'AR'
          if (includes(activityName, 'ETH')) token = 'ETH'
          if (includes(activityName, 'SOL')) token = 'SOL'
          if (network) {
            token = activityName.split(' ').pop()
          }

          if (
            activityName === ACTIVITY_NAME.CONTRACT_INTERACTION ||
            activityName === ACTIVITY_NAME.UNKNOWN
          )
            tokenType = 'ETH'

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
          blockUrl,
          displayExploreBlock
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
            'flex justify-between items-center px-4.25 pl-5 h-18.25 border-b border-trueGray-400',
            !seen && 'font-semibold'
          )}
          style={{ height: '82px' }}
        >
          <div className="w-3/5 flex flex-col relative mt-1">
            {!seen && (
              <div className="absolute -left-3.25 top-1.75">
                <GreenDotIcon />
              </div>
            )}
            <div className="text-sm font-semibold text-blue-800 leading-5">
              {activityName.length <= 21 ? activityName : `${activityName.substring(0, 19)}...`}
            </div>
            {(activityName.includes('Received') || activityName.includes('Sent')) && (
              <div className="text-xs text-blue-800">
                {activityName.includes('Sent') ? 'to' : 'from'}{' '}
                <span className="text-success-700">{formatLongString(source, 10, true)}</span>
              </div>
            )}
            <div className="mt-0.75 text-xs font-semibold text-blue-800 leading-5">
              {accountName}
            </div>
          </div>
          <div className="w-2/5 flex flex-col items-end text-right mt-1">
            <div
              className={`text-sm font-semibold rounded-sm px-1 text-blue-800 ${
                get(displayInfo, 'expenseText').includes('-') ? 'bg-warning' : 'bg-success'
              } ${!seen && 'bg-opacity-50'} leading-5`}
            >
              {get(displayInfo, 'expenseText')}
            </div>
            <div className="text-xs text-success-700">{get(displayInfo, 'dateString')}</div>
            {displayInfo.displayExploreBlock ? (
              !expired ? (
                <a
                  href={displayInfo.blockUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'mt-0.75 px-2.5 flex justify-center items-center text-2xs text-blue-850 leading-4 rounded-2xl',
                    !pending ? 'bg-success' : isProcessing ? 'bg-lightBlue' : 'bg-warning'
                  )}
                  style={{ height: '23px' }}
                >
                  <ViewBlockIconNew style={{ width: '19px', height: '18px' }} />

                  {!pending ? 'Explore Block' : isProcessing ? 'Processing' : 'Pending'}
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
              )
            ) : (
              <ExploreBlock data-tip={'Coming soon'} />
            )}
            <ToolTip />
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityRow
