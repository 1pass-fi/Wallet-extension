import isEmpty from 'lodash/isEmpty'
import { getChromeStorage } from 'utils'

import getFetchWithTimeout from './utils'

export const getCurrentLocale = async () => {
  let currentLocale = (await getChromeStorage('CURRENT_LOCALE'))['CURRENT_LOCALE']

  if (!currentLocale) currentLocale = navigator.languages[0]

  return currentLocale
}

export const setupLocale = async (currentLocale) => {
  console.log('currentLocale', currentLocale)
  let currentLocaleMessages = currentLocale ? await fetchLocale(currentLocale) : {}
  if (isEmpty(currentLocaleMessages)) {
    currentLocaleMessages = await fetchLocale('en')
  }
  console.log('currentLocaleMessages', currentLocaleMessages)
  return currentLocaleMessages
}

export async function fetchLocale(localeCode) {
  try {
    const response = await getFetchWithTimeout(`./_locales/${localeCode}/messages.json`)
    return await response.json()
  } catch (error) {
    console.error(`failed to fetch ${localeCode} locale because of ${error}`)
    return {}
  }
}
