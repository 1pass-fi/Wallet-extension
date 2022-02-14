import moment from 'moment'
import React, { useMemo } from 'react'
import includes from 'lodash/includes'

import ViewBlockIcon from 'img/v2/view-block.svg'
import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-bg-white.svg'
import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

import { PATH, URL,ETH_NETWORK_PROVIDER } from 'constants/koiConstants'
import formatLongString, { formatLongStringTruncate } from 'finnie-v2/utils/formatLongString'
import formatNumber from 'finnie-v2/utils/formatNumber'
import clsx from 'clsx'

const ActivityRow = ({
  activity: { activityName, address, date, expense, id, source, network }
}) => {
  const displayInfo = useMemo(() => {
    const dateString = moment(date).format('MM/DD/YYYY')

    let tokenType = 'AR'
    if (includes(activityName, 'ETH')) {
      tokenType = 'ETH'
    } else if (includes(activityName, 'KOII')) {
      tokenType = 'KOII'
    }

    let url = `${PATH.VIEW_BLOCK_TRANSACTION}/${id}`
    if (network) {
      url =
        network === ETH_NETWORK_PROVIDER.MAINNET
          ? `${URL.ETHERSCAN_MAINNET}/tx/${id}`
          : `${URL.ETHERSCAN_RINKEBY}/tx/${id}`
    }

    let from = ''
    let to = ''
    if (!source) {
      from = address
      to = ''
    } else if (includes(activityName, 'Received')) {
      from = source
      to = address
    } else {
      from = address
      to = source
    }

    return {
      tokenType,
      dateString: dateString,
      action: activityName,
      from,
      to,
      amount: expense,
      url,
      receiving: includes(activityName, 'Received')
    }
  }, [])

  return (
    <tr className="h-15 border-b border-blue-700 px-4">
      <td className="px-1">{displayInfo.dateString}</td>
      <td className="px-1">{formatLongStringTruncate(displayInfo.action, 20)}</td>
      <td className="px-1">
        {displayInfo.tokenType === 'ETH' ? (
          <EthereumLogo className="w-5 h-5 mr-2 inline-block" />
        ) : (
          <KoiiLogo className="w-5 h-5 mr-2 inline-block" />
        )}
        {formatLongString(displayInfo.from, 20)}
      </td>
      <td className="px-1">{formatLongString(displayInfo.to, 20)}</td>
      <td
        className={clsx(
          'px-1 font-semibold',
          displayInfo.receiving ? 'text-success-900' : 'text-red-finnie'
        )}
      >
        {displayInfo.receiving ? '+' : '-'}
        {formatNumber(displayInfo.amount, 6)}
        {` ${displayInfo.tokenType}`}
      </td>
      <td className="px-1">
        <a
          href={displayInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-end text-xs text-turquoiseBlue underline font-semibold leading-5"
        >
          <ViewBlockIcon className="pr-1.375" />
          {displayInfo.tokenType === 'ETH' ? 'Etherscan' : 'Explore Block'}
        </a>
      </td>
    </tr>
  )
}

export default ActivityRow
