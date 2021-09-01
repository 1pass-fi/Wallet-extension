import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import { PATH } from 'constants/koiConstants' 
import { transactionAmountFormat } from 'utils'
import ShareIcon from 'img/share-icon-purple.svg'

import './index.css'

const ConfirmedAsset = ({ id, title, date }) => {
  const dateFormat = (date) => {
    return moment(date).format('MMMM Do, YYYY')
  }

  return (
    <div className="confirmed-asset-container">
      <div className='confirmed-asset-info'>
        <div className='date'>{date}</div>
        <div className='text'>
          <span>{title}</span> is stored forever on Arweave!
          <div className='share-icon'><ShareIcon /></div>
        </div>
        <div className='share-button'><button>Share Now!</button></div>
        <div className='view-block'><a href='#'>view block</a></div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({ price: state.price, currency: state.currency })

export default connect(mapStateToProps)(ConfirmedAsset)
