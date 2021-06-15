import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import { PATH } from 'koiConstants' 
import { transactionAmountFormat } from 'utils'

import './index.css'

const propTypes = {
  id: PropTypes.string,
  activityName: PropTypes.string,
  expense: PropTypes.number,
  pending: PropTypes.bool,
  date: PropTypes.string,
  source: PropTypes.string,
}

const ActivityRow = ({activityName, expense, date, source, id, pending, price }) => {
  const dateFormat = (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }
  
  const currency = activityName.includes('KOI') ? 'KOI' : 'AR'
  const sign = activityName.includes('Received') ? '+' : '-'
  const sourceStr = source ? `${source.slice(0,7)}...${source.slice(source.length - 9)}` : ''

  return (
    <div className="activity-row-container">
      <div className='activity-info'>
        <div className='activity-info-row left'>
          <div className='title'>
            <div className='activity-name'>{activityName}</div>
            {
              (activityName.includes('Received') || activityName.includes('Sent')) &&
              <div className='subtitle'> {sign === '+' ? 'from' : 'to'} {sourceStr}</div>
            }
          </div>
          {pending ? (
            <div className="activity-status pending">Transaction pending</div>
          ) : (
            <div className='activity-status completed'> 
              <a target="_blank" href={`${PATH.VIEW_BLOCK_TRANSACTION}/${id}`}>
              view block
              </a>
            </div>
          )}
        </div>
        <div className='activity-info-row'>
          <div className='activity-expense'>{ (expense != null && expense > 0) ? sign : ''}{transactionAmountFormat(expense)} {currency}</div>
          { expense != null && 
            <div className='activity-expense usd'>{transactionAmountFormat(expense*price[currency])} USD</div>
          } 
          <div className='activity-date'>{ dateFormat(date) }</div>
        </div>
      </div>
    </div>
  )
}

ActivityRow.propTypes = propTypes

const mapStateToProps = (state) => ({ price: state.price })

export default connect(mapStateToProps)(ActivityRow)
