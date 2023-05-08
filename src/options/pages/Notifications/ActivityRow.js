import React, { useMemo } from 'react'
import clsx from 'clsx'
import { ACTIVITY_NAME, ETH_NETWORK_PROVIDER, PATH, URL } from 'constants/koiConstants'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ExploreBlock from 'img/v2/explore-block-coming-soon.svg'
import KoiiLogo from 'img/v2/k2-logos/finnie-k2-logo.svg'
import SolanaLogo from 'img/v2/solana-logo.svg'
import ViewBlockIcon from 'img/v2/view-block.svg'
import includes from 'lodash/includes'
import moment from 'moment'
import formatLongString, { formatLongStringTruncate } from 'options/utils/formatLongString'
import formatNumber from 'options/utils/formatNumber'

const ActivityRow = ({
  activity: { activityName, address, date, expense, id, source, network, isK2Account }
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
          : `${URL.ETHERSCAN_GOERLI}/tx/${id}`
    }

    if (includes(activityName, 'SOL')) {
      url = `${URL.SOLANA_EXPLORE}/tx/${id}?cluster=${network}`
      tokenType = 'SOL'
    }

    if (isK2Account) {
      url = `${URL.K2_EXPLORER}/tx/${id}`
      tokenType = 'KOII'
    }

    if (network) {
      tokenType = activityName.split(' ').pop()
    }

    if (
      activityName === chrome.i18n.getMessage('contractInteraction') ||
      activityName === chrome.i18n.getMessage('unknownTransaction')
    )
      tokenType = 'ETH'

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
        {network === ETH_NETWORK_PROVIDER.MAINNET ||
          (network == ETH_NETWORK_PROVIDER.GOERLI && (
            <EthereumLogo className="w-5 h-5 mr-2 inline-block" />
          ))}
        {displayInfo.tokenType === 'SOL' && <SolanaLogo className="w-5 h-5 mr-2 inline-block" />}
        {displayInfo.tokenType === 'AR' && <ArweaveLogo className="w-5 h-5 mr-2 inline-block" />}
        {displayInfo.tokenType === 'KOII' && <KoiiLogo className="w-5 h-5 mr-2 inline-block" />}

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
          {network === ETH_NETWORK_PROVIDER.MAINNET || network === ETH_NETWORK_PROVIDER.GOERLI
            ? chrome.i18n.getMessage('etherscan')
            : chrome.i18n.getMessage('exploreBlock')}
        </a>
      </td>
    </tr>
  )
}

export default ActivityRow
