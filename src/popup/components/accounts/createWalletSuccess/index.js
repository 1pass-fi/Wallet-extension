import React from 'react'
import Button from 'shared/button'

import './index.css'

export default () => {
  return (
    <div className='create-wallet-wrapper'>
      <div className='create-wallet-success'>
        <div className='congratulations-section'>
          <div className='title'>Congratulations!</div>
          <div className='details'>
            You successfully created your wallet.
          </div>
        </div>
        <div className='tips-section'>
          <div className='title'>Remember to keep your seed phrase safe.</div>
          <div className='details'>
            <div className='safekeeping'>A few tips for safekeeping:</div>
            <div className='tips-set'>
              <p className='tip-item'>Save a backup copy in several places. </p>
              <p className='tip-item'>
                Never share your seed phrase or keyfile with anyone.{' '}
              </p>
              <p className='tip-item'>
                Stay safe from phishing scams— Koii will never ask you for your
                seed phrase or keyfile.
              </p>
              <p className='tip-item'>
                If you have questions or see something suspicious, email us
                at&nbsp;
                <a className='security-link'>support@koii.network</a>.
              </p>
            </div>
          </div>
        </div>
        <div className='button-line'>
          <Button
            className='create-wallet-success-button skip'
            label={'Finish'}
            onClick={() => window.close()}
          ></Button>
        </div>
      </div>
    </div>
  )
}
