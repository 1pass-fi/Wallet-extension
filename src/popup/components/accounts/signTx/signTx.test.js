import '@babel/polyfill'
import { fireEvent, getByText, queryAllByTestId, render, wait, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import sinon from 'sinon'

import { utils } from 'utils'
import { SignTx } from '.'
import { STORAGE } from 'koiConstants'


describe('Test for ImportPhraseLockScreen component', () => {
  let setErrorMock, signTransactionMock, container, accountName, price, getChromeStorageStub, sourceAddressEle, targetAddressEle, originEle
  beforeEach(async () => {
    getChromeStorageStub = sinon.stub(utils, 'getChromeStorage')
    getChromeStorageStub.withArgs(STORAGE.PENDING_REQUEST).resolves({ [STORAGE.PENDING_REQUEST]: { data: {
      origin: 'origin',
      qty: 100,
      address: 'targetAddress'
    } } })
    getChromeStorageStub.withArgs(STORAGE.KOI_ADDRESS).resolves({ [STORAGE.KOI_ADDRESS]: 'koiAddress' })
    setErrorMock = jest.fn()
    signTransactionMock = jest.fn()
    accountName = 'accountName',
    price = { AR: 1, KOI: 2 }

    container = render(<SignTx
      signTransaction={signTransactionMock}
      setError={setErrorMock}
      accountName={accountName}
      price={price}
    />).container
    await waitFor(() => {
      sourceAddressEle = queryAllByTestId(container, 'source-address')[0]
      targetAddressEle = queryAllByTestId(container, 'target-address')[0]
      originEle = queryAllByTestId(container, 'origin')[0]
    })

  })

  afterEach(() => {
    sinon.reset()
    getChromeStorageStub.restore()
  })

  describe('renders without crashing', () => {
    it('renders correctly', async () => {
      expect(container).toMatchSnapshot()
    })
  })

  describe('load data from local storage and set state', () => {
    it ('renders with data from local storage', () => {
      expect(sourceAddressEle.textContent).toEqual('koiAddress')
      expect(targetAddressEle.textContent).toEqual('targetAddress')
      expect(originEle.textContent).toEqual('origin')
    })
  })
})
