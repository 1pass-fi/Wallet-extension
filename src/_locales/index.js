import isEmpty from 'lodash/isEmpty'
import { getChromeStorage } from 'utils'

import getFetchWithTimeout from './utils'

export default async function setupLocale() {
  let currentLocale = (await getChromeStorage('CURRENT_LOCALE'))['CURRENT_LOCALE']

  if (!currentLocale) currentLocale = navigator.languages[0]

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
