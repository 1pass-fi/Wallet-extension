// modules
import React, { useEffect,useState } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
// constants
import { ETH_NETWORK_PROVIDER, ETHERSCAN_API, PATH, URL } from 'constants/koiConstants'
import { get,includes } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
// utils
import { transactionAmountFormat } from 'utils'

// styles
import './index.css'

const propTypes = {
  id: PropTypes.string,
  activityName: PropTypes.string,
  expense: PropTypes.number,
  pending: PropTypes.bool,
  date: PropTypes.string,
  source: PropTypes.string,
}

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
  handleExpiredAction, 
  address,
  network 
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
        let fromToAddress, blockButtonText, pendingOrExpired, expenseText, toUsdText, dateString, blockUrl
  
        recipientOrSender = source ? `${source.slice(0,4)}...${source.slice(source.length - 5)}` : ''
  
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
          if (network === ETH_NETWORK_PROVIDER.MAINNET) blockUrl = `${URL.ETHERSCAN_MAINNET}/tx/${id}`
          if (network === ETH_NETWORK_PROVIDER.GOERLI) blockUrl = `${URL.ETHERSCAN_GOERLI}/tx/${id}`
        }
  
        if (!includes(activityName, 'Bridge')) {
          let sign = includes(activityName, 'Received') ? '+' : '-'
          let token = includes(activityName, 'KOII') ? 'KOII' : 'AR'
          if (includes(activityName, 'ETH')) token = 'ETH'
  
          expenseText = `${expense !== null && expense > 0 ? sign : ''}${transactionAmountFormat(expense)} ${token}`
  
          toUsdText =  `${transactionAmountFormat(expense*price[token])} ${currency}`
        } else {
          expenseText = ''
          toUsdText = ''
        }

        dateString = dateFormat(date)

        info = { fromToAddress, blockButtonText, pendingOrExpired, expenseText, toUsdText, dateString, blockUrl }
        setDisplayInfo(info)
        setLoaded(true)
      } catch (err) {
        console.log('Load activity info error: ', err.message)
      }
    }

    loadDisplayData()
  }, [expired])

  return (
    <div className="activity-row-container">
      {loaded && <div className='activity-info'>
        {/* 
          ON LEFT:
          - Title, toAddress
          - Account name
          - view block button
          - status
        */}
        <div className='activity-info-row left'>
          {/* 
            activity title + recipient address
          */}
          <div className='title'>
            <div className='activity-name'>{activityName}</div>
            {
              (activityName.includes('Received') || activityName.includes('Sent')) &&
              <div className='subtitle'>{get(displayInfo, 'fromToAddress')}</div>
            }
          </div>

          {/* 
            account name
          */}
          <div className='account-name'>{accountName}</div>

          {/* 
            view block button
            - Confirmed: view block
            - Pending: explore block (expect receving 404 on viewblock.io)
            Different text, do same thing.
          */}
          {!includes(activityName, 'Bridged') && <div className='activity-status completed'>
            <a target="_blank" href={get(displayInfo, 'blockUrl')}>
              {get(displayInfo, 'blockButtonText')}
            </a>
          </div>}

          {/* 
            pending status
            - Transaction pending: waiting for confirmation
            - Transaction expired: click to make an action - delete or resend
          */}
          {pending && <div className={!expired ? 'activity-pending' : 'activity-pending expired'}>
            {!expired ? 
              get(displayInfo, 'pendingOrExpired') : 
              <span data-tip="Take an action" onClick={() => handleExpiredAction({txId: id, address, activityName})}>
                {get(displayInfo, 'pendingOrExpired')}
              </span>}
          </div> }
        </div>


        {/* 
          ON RIGHT:
          - Expense amount
          - To usd (and others)
          - Date
        */}
        <div className='activity-info-row'>
          {/* 
            expense
          */}
          {<div className='activity-expense'>{get(displayInfo, 'expenseText')}</div>}
          {/* 
            to usd
          */}
          { expense != null && !includes(activityName, 'ETH') &&
            <div hidden={activityName.includes('KOII')} className='activity-expense usd'>{get(displayInfo, 'toUsdText')}</div>
          } 
          {/* 
            date
          */}
          <div className='activity-date'>{get(displayInfo, 'dateString')}</div>
        </div>
        <ReactTooltip place='top' type="dark" effect="float"/>
      </div>
      }
    </div>
  )
}

ActivityRow.propTypes = propTypes

const mapStateToProps = (state) => ({ price: state.price, currency: state.currency })

export default connect(mapStateToProps)(ActivityRow)
