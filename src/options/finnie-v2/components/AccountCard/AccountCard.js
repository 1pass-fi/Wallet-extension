import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import isNumber from 'lodash/isNumber'

import { GalleryContext } from 'options/galleryContext'

import DropDown from 'finnie-v2/components/DropDown'

import storage from 'services/storage'
import { TYPE } from 'constants/accountConstants'
import formatNumber from 'finnie-v2/utils/formatNumber'
import { getSiteConnectedAddresses } from 'utils'

import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-orange.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import SolLogo from 'img/v2/solana-logo.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import DragIcon from 'img/v2/settings/drag-icon.svg'
import EditIcon from 'img/v2/settings/edit-icon.svg'
import CopyIcon from 'img/v2/settings/copy-icon.svg'
import FilledStarIcon from 'img/popup/star-filled-icon.svg'
import EmptyStarIcon from 'img/popup/star-empty-icon.svg'
import ExtendIcon from 'img/extend-icon.svg'
import ReavealSeedphraseIcon from 'img/v2/settings/reveal-seedphrase-icon.svg'
import SeeQRIcon from 'img/v2/settings/see-QR-icon.svg'
import SeeExtensionIcon from 'img/v2/settings/see-extension-icon.svg'
import RecycleBinIcon from 'img/v2/recycle-bin-icon.svg'

const AccountCard = ({ account }) => {
  const [isDrop, setIsDrop] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState('')

  const defaultArweaveAccountAddress = useSelector((state) => state.defaultAccount.AR?.address)
  const defaultK2AccountAddress = useSelector((state) => state.defaultAccount.K2?.address)
  const defaultEthereumAccountAddress = useSelector((state) => state.defaultAccount.ETH?.address)
  const defaultSolanaAccountAddress = useSelector((state) => state.defaultAccount.SOL?.address)

  useEffect(() => {
    const getCurrentProvider = async (accountType) => {
      let currentProvider
      if (accountType === TYPE.ETHEREUM) {
        currentProvider = await storage.setting.get.ethereumProvider()
      } else if (accountType === TYPE.SOLANA) {
        currentProvider = await storage.setting.get.solanaProvider()
      } else if (accountType === TYPE.K2) {
        currentProvider = await storage.setting.get.k2Provider()
      } else if ((accountType = TYPE.ARWEAVE)) {
        currentProvider = 'mainnet'
      }

      setCurrentNetwork(currentProvider)
    }
    getCurrentProvider(account.type)
  }, [account])

  const isDefaultAccount = (account) => {
    switch (account.type) {
      case TYPE.ARWEAVE:
        return account.address === defaultArweaveAccountAddress
      case TYPE.K2:
        return account.address === defaultK2AccountAddress
      case TYPE.ETHEREUM:
        return account.address === defaultEthereumAccountAddress
      case TYPE.SOLANA:
        return account.address === defaultSolanaAccountAddress
      default:
        return false
    }
  }
  const providerOptions = [
    {
      type: TYPE.ETHEREUM,
      value: [
        {
          label: 'ETH Mainnet',
          value: 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
        },
        {
          label: 'Rinkeby TestNet',
          value: 'https://rinkeby.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
        }
      ]
    },
    {
      type: TYPE.K2,
      value: [
        {
          label: 'Mainnet',
          value: 'mainnet-beta'
        },
        {
          label: 'Testnet',
          value: 'testnet'
        },
        {
          label: 'Devnet',
          value: 'devnet'
        }
      ]
    },
    {
      type: TYPE.SOLANA,
      value: [
        {
          label: 'Mainnet',
          value: 'mainnet-beta'
        },
        {
          label: 'Testnet',
          value: 'testnet'
        },
        {
          label: 'Devnet',
          value: 'devnet'
        }
      ]
    },
    {
      type: TYPE.ARWEAVE,
      value: [
        {
          label: 'Mainnet',
          value: 'mainnet'
        }
      ]
    }
  ]

  const onNetworkChange = (networkAddress) => {
    if (networkAddress !== currentNetwork) {
      // TODO DatH
      console.log('onNetworkChange', networkAddress)
    }
  }

  return (
    <div className="mt-4.5 text-indigo select-none">
      <div
        className="relative py-6 -mb-1.25 bg-trueGray-100 rounded-lg flex items-center justify-start shadow-md overflow-hidden"
        style={{ width: '707px', height: '124px' }}
      >
        <div
          className="flex items-center justify-center bg-white shadow rounded-r-lg"
          style={{ width: '22.5px', height: '55.25px' }}
        >
          <DragIcon style={{ width: '4.93px', height: '31.49px' }} />
        </div>
        {account.type === TYPE.K2 && (
          <KoiiLogo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        {account.type === TYPE.ETHEREUM && (
          <EthLogo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        {account.type === TYPE.SOLANA && (
          <SolLogo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        {account.type === TYPE.ARWEAVE && (
          <ArweaveLogo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        <div className="flex flex-col ml-2.25 mr-4.5 mt-1" style={{ width: '296px' }}>
          <div className="flex items-center">
            <div className="font-semibold text-base tracking-finnieSpacing-tight leading-6">
              {account.accountName}
            </div>
            <div
              className="ml-3.75 bg-lightBlue rounded-full shadow-sm cursor-pointer"
              style={{ width: '16px', height: '16px' }}
            >
              <EditIcon />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-success-700 text-opacity-80 text-2xs font-normal leading-6 tracking-finnieSpacing-tight">
              {account.address}
            </div>
            <div
              className="flex items-center justify-center my-auto bg-lightBlue rounded-full shadow-sm cursor-pointer"
              style={{ width: '16px', height: '16px' }}
            >
              <CopyIcon style={{ width: '14px', height: '14px' }} />
            </div>
          </div>

          {account.type === TYPE.K2 && (
            <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
              Balance:
              {formatNumber(account.balance, 4) !== 'NaN'
                ? formatNumber(account.balance / Math.pow(10, 9), 4)
                : '0'}{' '}
              KOII
            </div>
          )}
          {account.type === TYPE.ETHEREUM && (
            <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
              Balance:
              {formatNumber(account.balance, 4) !== 'NaN'
                ? formatNumber(account.balance, 4)
                : '0'}{' '}
              ETH
            </div>
          )}
          {account.type === TYPE.SOLANA && (
            <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
              Balance:
              {formatNumber(account.balance, 4) !== 'NaN'
                ? formatNumber(account.balance / Math.pow(10, 9), 4)
                : '0'}{' '}
              SOL
            </div>
          )}
          {account.type === TYPE.ARWEAVE && (
            <>
              <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
                Balance: {isNumber(account.balance) ? formatNumber(account.balance, 4) : '0'} AR
              </div>
              {/* <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
                Koii Balance:{' '}
                {isNumber(account.koiBalance) ? formatNumber(account.koiBalance, 2) : '0'} KOII
              </div> */}
            </>
          )}

          <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight leading-6">
            Assets: {account.totalAssets.length}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1"
            style={{ width: '75px', height: '75px' }}
          >
            <div className="flex items-center text-center font-normal text-xl leading-8 tracking-finnieSpacing-tight">
              4
            </div>
            <div className="flex items-center text-center font-normal text-xs tracking-finnieSpacing-tight">
              Coins
            </div>
          </div>

          <div
            className="flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1"
            style={{ width: '75px', height: '75px' }}
          >
            <div className="flex items-center text-center font-normal text-xl leading-8 tracking-finnieSpacing-tight">
              {account.totalAssets.length}
            </div>
            <div className="flex items-center text-center font-normal text-xs tracking-finnieSpacing-tight">
              Assets
            </div>
          </div>

          <div
            className="flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1"
            style={{ width: '75px', height: '75px' }}
          >
            <div className="flex items-center text-center font-normal text-xl leading-8 tracking-finnieSpacing-tight">
              1.234
            </div>
            <div className="flex items-center text-center font-normal text-xs tracking-finnieSpacing-tight">
              Views
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col justify-between items-center ml-4">
          {/* TODO DatH - Change account with star clicking */}
          <div className="flex items-center justify-center">
            {isDefaultAccount(account) ? (
              <FilledStarIcon
                style={{ width: '20px', height: '20px' }}
                className="cursor-pointer"
              />
            ) : (
              <EmptyStarIcon style={{ width: '20px', height: '20px' }} className="cursor-pointer" />
            )}
          </div>
          <div
            className="flex items-center justify-center bg-lightBlue shadow-sm rounded-full cursor-pointer"
            style={{ width: '24px', height: '24px' }}
            onClick={() => setIsDrop((prev) => !prev)}
          >
            <ExtendIcon
              style={{ width: '8px', height: '4.25px' }}
              className={clsx(isDrop && 'transform rotate-180')}
            />
          </div>
        </div>
      </div>

      {isDrop && (
        <div
          className="flex items-center justify-start bg-trueGray-600 px-5 py-6"
          style={{ width: '707px', height: '183px' }}
        >
          <div className="w-1/3 h-full flex flex-col gap-6">
            <div className="flex gap-2.75 items-start">
              <div className="w-1/2 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                Account Balance:
              </div>

              <div className="font-normal text-xs tracking-finnieSpacing-tight">286.22 KOII</div>
            </div>

            <div className="flex gap-2.75 items-start">
              <div className="w-1/2 flex justify-end text-right font-semibold text-xs tracking-finnieSpacing-tight">
                NFT Assets:
              </div>
              <div className="font-normal text-xs tracking-finnieSpacing-tight">286.22 KOII</div>
            </div>
          </div>

          <div className="w-1/3 h-full flex flex-col gap-4.5">
            <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">Network: </div>
              <div style={{ width: '154px' }}>
                <DropDown
                  options={providerOptions.find((o) => o.type === account.type)?.value}
                  value={currentNetwork}
                  onChange={onNetworkChange}
                  filterSupported={false}
                  variant="light"
                  size="sm"
                />
              </div>
            </div>
            <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">
                Show Hex data:{' '}
              </div>
              <div className="bg-yellow-300" style={{ width: '38.89px', height: '20px' }}></div>
            </div>
            <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">
                Hide empty Token:{' '}
              </div>
              <div className="bg-yellow-300" style={{ width: '38.89px', height: '20px' }}></div>
            </div>
            <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">
                Dapp Connections:{' '}
              </div>
              <div
                className="text-xs font-normal tracking-finnieSpacing-tight underline cursor-pointer"
                style={{ width: '38.89px', height: '20px' }}
              >
                2 sites
              </div>
            </div>
          </div>

          <div className="w-1/3 h-full flex flex-col gap-4.5">
            <div className="w-full h-6 flex gap-4 items-center">
              <div className="w-3/4 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                Reveal Seed Phrase:{' '}
              </div>
              <div
                className="bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                style={{ width: '24px', height: '24px' }}
              >
                <ReavealSeedphraseIcon style={{ width: '15.43px', height: '15.17px' }} />
              </div>
            </div>

            <div className="w-full h-6 flex gap-4 items-center">
              <div className="w-3/4 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                See QR code:{' '}
              </div>
              <div
                className="bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                style={{ width: '24px', height: '24px' }}
              >
                <SeeQRIcon style={{ width: '12.89px', height: '12.93px' }} />
              </div>
            </div>

            <div className="w-full h-6 flex gap-4 items-center">
              <div className="w-3/4 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                See on extension:{' '}
              </div>
              <div
                className="bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                style={{ width: '24px', height: '24px' }}
              >
                <SeeExtensionIcon style={{ width: '12.54px', height: '15.75px' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountCard
