import '@babel/polyfill'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import { get, isNumber } from 'lodash'

import './Popup.css'
import Header from 'components/header'
import Loading from 'components/loading'
import Account from 'components/accounts'
import Assets from 'components/assets'
import Activity from 'components/activity'
import Setting from 'components/setting'
import Message from 'components/message'
import continueLoadingIcon from 'img/continue-load.gif'

import { setIsLoading } from 'actions/loading'
import { setError } from 'actions/error'
import { setNotification } from 'actions/notification'
import { setWarning } from 'actions/warning'
import { setPrice } from 'actions/price'
import { setKoi, loadWallet, removeWallet, getBalances } from 'actions/koi'

import { HEADER_EXCLUDE_PATH, STORAGE, REQUEST, PATH } from 'koiConstants'

import { getChromeStorage, setChromeStorage } from 'utils'
import axios from 'axios'
import { getAffiliateCode, claimReward, getRegistrationReward, submitInviteCode } from 'utils'
import Arweave from 'arweave'

import { koi } from 'background'
koi.wallet = {
  'kty':'RSA',
  'n':'4Icf50pS0UTcXbHlvEAyVbDFqenhKi2eCSYkX3NUQBBm9dVnSEM04BWpqFlHYoTFUcEk5OY_8CD7XEBVvVzl4ZG-EwbMZkRGqKxDv0yS0zr-Juk_gaH4NFndQzBEh9jSl58-7KFyB1kmDXXE-ulYEp5eVPHedQoO4OkhqQUuIVQn8MSm7i7BE_XFAEW4XrjLbzZDodVicLP_mbUS2WmX1QnXjKNRCCCSb2lDm2GIhnJLbBeQvIYy1NHpVCICcKa8UaN9H6MVNyy9Vfc11rox57FoMS29DZjFKCliIxnFe11j_RlIA_3CJSqsNhGmCC2G8fQecVR23lFlkCY1U1aoGxHtBP2wgJKhngrs5Dgn82CqN_ycyKkQrtEuI-U7BoLjCIO0xhhDYFRONz1mHx266yfbygiKAEJZWarXPzc_rDq0uZzGydBgajosNJ5c7tv-NehTqCFWH4qFNXn9wb-hm9Gw8_p8-1MQA4NUGo_e0SZvzc2xj8XiveOmmCJf4sYkpyV77bNdwXK3jw4_0Bb1SaOLeUTdsftzX_FSsVMVH2q5D1HsYgVjIsV7I4md8GJu3aSHp3LzXPtb7nZpau0Btd5cMc_MDyfoMCjpXb1v54DZEeV42xojaSKn969w-O4IqV8HuKCrKWVZzaWw9cd37JINCh1Kcq4doowAatuW6V8',
  'e':'AQAB',
  'd':'UlmdHPLIn1KXVJIcBcix7XXxeZl7aUHj9c0UiCG_o-OgL8g-omVr7khjuohMQ1kZGhwyEPZWOxeNuc8q41JASlRvF4Fl1Jh0JgdQrchDDdBUSSdBkKU8aM8Q9UStzfl7e_r_VED-lq1e5I7uWWzeTa3iQVuY0OqIfHtlSh3JRpYcNBWceD2TuWNqBuiLb8ptavPHKIMgIOAT_mdIa49sDcoXUdDQtp9jthMwpbvHHDCtcw7NmifKWv5GiwISTQkKhxLkoIbrEBqLsw0BpSkThrwtz-PLtEH1Bf7vrJoWMWIWe00becNHwuP817PvZo50MSftRnnJQ08tZgptgoyFCQCud_7OWECrNxRRivWhG_vmZ1Jzztyx5vkk6XVIeGuagkmXqj4qznLbtn8lP90pl6nVOUsz1bc5SZhz03mnMq0IRQOerp2JfdvNr71G2UAZdd_k6w0s7gYogfNE85htNtGfiq1yqbkpMLmqOVhai_PoJbA-IFzPwsDcVLp-Tg7aD-9AzhPismenIVY3ZDJe-NLG1_ztOhcfpLuFpViMJna41IdMg75dAuOVePkdgQB33QPSnzxL9rnMhlqwGlfS-sPRcWQT5SPH5nqafF4UD4Psx7HH_ufDEhcjeyav0B9jAR4U38VElB7UmJv2Rpe6FmQGHxz3yuVWYXs9UAdxluE',
  'p':'-Zz4jeRcix98hz6BZmilb73YyuXYDZjz_URLJtoy0VjlqEfZentZciTlsGnNiNCAzIfL4tXa9dTFftfQLeB_S7ORPWmUTrztaODMzDFECYr9ItNFt72xtec691XTtoxkgnHH_NetR1Ex3zQV1t5DLwq0TF_0SrYGjTd1ZWj6rQzzhj-1H7K0jNc2LS2HzRDvMFJp4TaUsQ6SxnUDtThoaWk-i1W97tZZoIUWhdK5ZyHYE568LeIvrfbTKPitRT5KJRbrp1MtPV50AVcniFuPHqJKkOsMcn5j3DhteoU-AcwROPd-pooYT8RXr4qK0MxDIPCupnTRNR6HD_-hr8M3Lw',
  'q':'5kXWo66LBxk__V1Clv_x5s0sxweZ-8UN20uZTwfY5pQd2bYX3mgSfuuxRBkYdcT-Cgk0k37n7nnmBZPuUAdstHB7960wmt4wATx1HOWoV1Nd_YYlk8gAZfdNEBTnk9Clq028-QUXZAP7mskMZTUJJG8KZiFzfXlLy6OimKLZWIN2j4-TtCHs4-Z-E6m5eKqFOWKLmwVpWdbmKWyS74tWEWP5SbQDjuZ9dRb5uJDnRoZmbvM3mdoCKSOKxsCjf8Sr1yG17UklUHtVRI-9vz2WW4s1CwyaDk13bBl7l8FoeiOlZYyyjsKjM4vGaFUlLCYbRT9ibbKVDZX4VPuV7L_k0Q',
  'dp':'z6QRa0984EpX99U6JWuFu1ds4ROjz2PeC1_lODOotFdD6-Gg-u9jL72byE2rKVVw3zNTmqWVWIwfoe17Ar7OhbWhaznJolotD-J42p9c3qdc_bxMMZW-H_hzJ86gqClPbuehmiX7wei8GNWmGTCZKKe55hKoEAItnwl0QeC7LnsolROn4u9wm_xm19wZLLAamNLluvABbuwVkrtCU1zSFmXzHks8DVMICazMWJQ7oJwZt_CCz5RpX0iEzX9X-9LeMM5JR868QmGxFHBgtWCcxLnyV2z_1Lpo7YePIq12MF6GMSJIm9cidDB7VM5lvV09tkggsN1aLtrvNZLL-H7nBw',
  'dq':'Qm-LyZWmDto-F_88Iwyc4hX4AUQ0LOthYA-jn6WH8p5xLkrXABfOnkep0Rfccr3u_T5CqPtINwl8T8eqTfSWbEi3u3GAQG4yM2kZ8MhhlTA8QdTeKpDdbI248hbV6VOdOJspFj9dzEFJ6hJvPRPcG2LeATFNfLnuIEaJtrflNSBYqHqoBqRzEB2D6nBhTmsEHNZNqOAa0QyrQvBMREhTAJlzZsxE6omdUJbcXV-RGkvUadZKCF1Zmjzi4QzbHxXC7kKPlnIwDdRHeYxvFinSo366QwHTwKSg-9MuUU4_sl1ubqn1KjMFmu2MxLUsEFy-KXBsGXIYht7p0rrzOmbywQ',
  'qi':'PDKwmtli1itxX5J41AgBpuCDulJWBvNmeZZPaIOCaT7izHKmPnLsBmVm5F8hhV2YGtlBCWUcj4rLG_xIqeeM0_ESE3kWyE8Id_xZeLdm20w7mmN4EsnhPB0tiZSa82o5qJzlMwP_SGtURKvBPFUfuB1LEfdTdaUzI4_TzVr3CGvt97ikecIsozKJt3EGTPPtzDzsReb5Tn2LBYoiGq_ayqNVJUtGiFtRn4guLXfMsW_bzFXjlfLTUV16lpVNOVXgWbZMaK5aRxXjhoeGzchL0Ktcfjd-CPXmQrKX6Mm7FcNYE3FRtthzY6gHDw8jjI8q8ERRrFaYq4OMoaRboh2E0w'
}

const wallet2 = {'kty':'RSA','e':'AQAB','n':'yUluur99hdvq-mtTrmr-dvoPuElPz0H2A4-u35tSF8Y0pQ4sIJumFWtVRobjv0rTs3pzib7wnoewwe5iqxbbFrkWDfyi9vK_4Wkf_m46ejd6Lzz5xQfi5vEOf2LSg2UdtaxJN4z9ZGwvYQOH2AWXsa9m1ALMlI_kB_UIMTGc4h_flRCJaJF9tps-3FVuhpD6dhc59nR6eRo5jfDW44YgGBjtgmGVXgQzrW197enci4cdpPK2JoYGZA1c7I42n45BJO74qgiE4ommRC-aVT38pQLBunnJ9w3SHhHorpjVrhpxwwl40fwh7LR-BrP9sAe2fj9P2Xmc10z4yRvM4CQ4MMyJwa-RxD96cV71UMLMPd7207C2AS72WYD6L2iIoi6g-z8V9mBl6QOMLWqnfT4fR27Yl49W8bqu_rg1VhdCNec5j9NxcOtm9bomAhgXVmK7Qnbvy0Bh1iatWaEg7HVuY5IfBO9RJPsqD97bg1mAsjwmAyt-aN02PCZDUsZ_7qT11PMA8KBdraKEoe4wjO2wfytAsmW9jAuCHX5FEQK_QHDqInm0iho8KpHamB1qfqO81IC67PL4W9otMyrZAHHWMzGykwREUAjQ7kOaR2OurC8GSxpjQl8GXXwGvM3j5K-SP69WHEjTLrZiYj1n6Kfz90ntFFIRhbAQmQbti1UpRw0','d':'Go7UzFENt8avd0EH9oBpeLs_rboGjLsQQaIImbo9l6NwOMLo8Zh3zmWuB7Mug4PU8N5cNjV6PAB9Quk4HYjTeWkMTuYhfmHDDXO4Y_KZRpzhQzBRaDzFJGFz3zzjt7B0vg6wTmMM394iVjOIDemW_Tu-XoTMB2IA3UfoP81i_Lbl4h4fcyuXIavUHHAtOBYS5dfkru7pZece5up6_-QngeZwF_7WHWSCiQRkVCrCDarTL3tSqzyNxU-6DgAplt3HHJ9nMdAT8GvnAyIgw9R87Cyz8O22xyEMsyj7wWWq8-DLV8d9KH-S3k9mPW4sL7ikzH2ABJq2JfYi8S341y4QN6wf5VtNHt-FODdmueSTzEMzc7n0x4DNL2TiH6ijjrZy5qTukuZBGEbVbtUgHizX5mUUn9r6jNwuhvjsl0Oco9HhWHwlkC90QQHVG1HrCBtwPHoUThrvS2gFBJgLeJ8yXUDTr8ff-GUYi4pLjmChHctdxkql06faRjMWgLZKiiHHj4AnPvgn87hJynfBjUkoMq7Ht7tgyqDedVEjXjkJfd6NIOJPM1NY0GqCRc0wHlcHqwiuqDwug2eLeMQiYjIoycO-Nj1pBp_mNTZ48X1GjBZjs8FXsixBv2q6rTgUNCkLtrMrgNJ6LY_h4TLY3tYIBHvu-m5gWIK26PBz7YmwGqU','p':'7PwmYvTXC05fNyI2IOJ5EVSaJ3spRt8g4e8NIAgT-eK4S5lOUh0zkPNU4jOC9yIpgY-ns9lZiAQAQbfNl6MeXoiJ1odQ9ebqF95l5Mr7QRdndmBhyJ3aj24RAwduu-0I8xGQsHh-e44el_VNrLeTRK7s5mgXXsfvMsumdEtkvjlfBv2Ls_SbMC35nYdRi3CjxBmeJ2xklfLYV60x1wzikU9cxLXDiCAxhHRQf-aYW7srpZeCEKJg_is3-2XNq6UpGnx3c6wAmHaTK6ini_k8Ig-mOTQNN6U538bna-JtnKieIhycDrob1sIbSqmsW_VZdwVFvRFYRcCAbrQXumld6w','q':'2XAEL6yVMmSgIDe5k4EeGAqHD6dz8NVm7CafG43tRQIV1koQvxbOu6SMyQZADxdPk32MTiu9XGaC9t-U3iAhUWmxTR1kWPZOa_MzMD0Mkt8ZUA7MsufiYxleylQXLjYNsz7RfJTYcPTFK1VjeClqYzZ_YxL-V1Lp8GW1W2AioJwIvqo36TchidSMQykJzY46WVChV1F6x5CRODfKb0t9ZvYuf37NIIIejZnnHerSnmVAR0wCYYd2lGU1yV2EaRUQeEJk_31l0q2iGOqMvZDdLc1mLG24MJbS5CifzcmQBigEhtp3jZX6kMXu4SfCac_TBtHye7HI9ihQ-44nUnaY5w','dp':'D-G2ENunrbJK3z8DsaB7zJWG3y55za4WXg3PK15fOFfhUe-sOASM-CHWhnI9TKKVdYFTE9J1FZBvE_hlZswftOYhlqbq3g_jkEXvPi38OJiA7oX3B6LMiuAtc66D1URFXUTIFYt9rnoPws9FrVWAIRI3_hjruAZeGWFcfl6vGbBuleFYA29ZFxl9qPjwlg-uae3tk2bINuRXa0jIFklexa4z4VrtB6pgpyfEXU3u1_brLeXBaav4JBBxZ_-ikOY4ovXEa5QTViRcKIjc8Zx6Uy4JTbwXRqtj_YMu7yP1hJIoRtD0BGikhPftLEvCqUb__-HykoEfEU2dTc3z6SI2kQ','dq':'G0WtgL1IyVVNsDzNDe838xP-9LuwExjxG9WMR0x54hns2z_W8eDOdUKiVeRuzHXECV_J5VQfICPLcWOBrIqjIy76ig2RtIbQN0H9vaMqnJFW_2-bxSTIhF1-Qiph7e3hsgXDCLkynJhW0qSXIU8whNklCSwsso83wGtBYACi1zo67o8zDBFaJ4t9PD89d4bLUsCGPAmAON-tFzwILAVv6SYfluY0nEs1wdT35Ay79hoFAexKsCjpeptnL6aHIRb_RdYuDM2Ro-cbWbyxgmVVGJWWpyPr4kxIj015HbqWUe9bAf8M17lkAByTZbIy9EqY0VYr78_QwO81mRevXux5KQ','qi':'TsPOnSHSRaj3mEZPt4dxAlB8-Jhig9qVJRv_SOPMZY8nqhSN09ltiVFEdBdcPEYwoCcPl8on9vKayfadMDzCZQ4t5qcnC9a38Y8Mdu3p2LXThhaZwLzWvtKXh9gZr9tOG-WBwN9Va2IPqR-lCINEnRpQ5c9PRZPchVwms1oWqvPzp_FiUSdGt6ZjwrsC9lgIl9GKaMtw6PIouX42sUmShUkHBcrhx4AuhENQyCmP29dztFqCdFVq1dWkb04KgEFYSSrK9y00ymIr7iBFzBOvqOx5wt2RRYawQKwflsq2X3XwseW8kVQyP85zXFBkPASatDHJYcQ2W0-gBn1i-N1wbg'}
koi.wallet = wallet2
const ContinueLoading = () => (
  <div className='continue-loading'>
    <img src={continueLoadingIcon} />
  </div>
)

const Popup = ({
  location,
  isLoading,
  isContLoading,
  setIsLoading,
  error,
  setError,
  notification,
  setNotification,
  warning,
  setWarning,
  loadWallet,
  getBalances,
  setPrice
}) => {
  const history = useHistory()
  useEffect(() => {
    async function getKoiData() {
      try {


        // get code from wallet 1
        // await koi.getWalletAddress()
        // console.log('CLAIM REWARD', await claimReward(koi))
        // console.log('AFFILIATE', await getAffiliateCode(koi))
        // console.log('REGISTRATION REWARD', await getRegistrationReward(koi))
        // console.log('SUBMIT CODE', await submitInviteCode(koi, '7572fbe2-3c19-4fe6-9523-d695dd740d30'))
        
        // const code = await getAffiliateCode(koi)
        // console.log({ code })
        // submit code of wallet 1 from wallet 2
        // koi.wallet = wallet2
        // koi.address = null
        // await koi.getWalletAddress()
        // console.log('ADDRESS: ', koi.address)

        const { KOI_ADDRESS, KOI_KEY, PENDING_REQUEST } = STORAGE
        const storage = await getChromeStorage([KOI_ADDRESS, KOI_KEY, PENDING_REQUEST])
        const query = window.location.search

        if (storage[KOI_ADDRESS]) {
          // Koi Address in local storage
          loadWallet({ data: storage[KOI_ADDRESS] })
          getBalances()
          switch (get(storage[PENDING_REQUEST], 'type')) {
            case REQUEST.PERMISSION:
              history.push('/account/connect-site')
              break
            case REQUEST.TRANSACTION:
              history.push('/account/sign-transaction')
              break
            default:
              history.push('/account')
          }
        } else {
          // Koi Address not in local storage
          if (storage[KOI_KEY]) {
            history.push('/account/login')
          } else if (query.includes('create-wallet')) {
            history.push('/account/create')
          } else if (query.includes('upload-json')) {
            history.push('/account/import/keyfile')
          } else {
            history.push('/account/welcome')
          }
        }
      } catch (err) {
        console.log(err.message)
        setError(err.message)
        setIsLoading(false)
      }
    }
    getKoiData()
  }, [])

  useEffect(() => {
    const loadPrice = async () => {
      try {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] })
        const storage = await getChromeStorage(STORAGE.PRICE)
        const { AR } = storage[STORAGE.PRICE] || { AR: 1 }
        setPrice({ AR })
        const { data } = await axios.get(PATH.AR_PRICE)
        const arPrice = get(data, 'arweave.usd')
        if (isNumber(arPrice)) {
          await setPrice({ AR: arPrice })
          const price =  { AR: arPrice, KOI: 1 }
          await setChromeStorage({ [STORAGE.PRICE]: price })
        }
      } catch(err) {
        setError(err.message)
      }
    }

    loadPrice()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [warning])

  const activities = [
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
  ]

  return (
    <div className="popup">
      {isContLoading && location.pathname === '/assets' && <ContinueLoading />}
      {isLoading && <Loading />}
      {error && <Message type='error' children={error} />}
      {notification && <Message type='notification' children={notification} />}
      {warning && <Message type='warning' children={warning} />}
      {!HEADER_EXCLUDE_PATH.includes(location.pathname) && <Header location={location} />}
      <div className='content'>
        <Switch>
          <Route path='/account'>
            <Account />
          </Route>
          <Route path='/assets'>
            <Assets />
          </Route>
          <Route path='/activity'>
            <Activity activities={activities} />
          </Route>
          <Route path='/setting'>
            <Setting />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.loading,
  error: state.error,
  notification: state.notification,
  warning: state.warning,
  koi: state.koi,
  transactions: state.transactions,
  isContLoading: state.contLoading,
  price: state.price
})

const mapDispatchToProps = {
  setIsLoading,
  setError,
  setNotification,
  setWarning,
  setKoi,
  loadWallet,
  removeWallet,
  getBalances,
  setPrice
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
