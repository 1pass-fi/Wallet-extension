import isEmpty from 'lodash/isEmpty'
import { getChromeStorage } from 'utils'

import getFetchWithTimeout from './utils'

export const getCurrentLocaleFromStorage = async () => {
  let currentLocale = (await getChromeStorage('CURRENT_LOCALE'))['CURRENT_LOCALE']
  if (!currentLocale) currentLocale = ''

  return currentLocale
}

export const setupLocale = async (currentLocale) => {
  let currentLocaleMessages
  if (!isEmpty(currentLocale)) {
    currentLocaleMessages = await fetchLocale(currentLocale)
    const defaultLocaleMessages = await fetchLocale('en') // TODO
    const getMessage = (key) =>
      !isEmpty(currentLocaleMessages[key])
        ? currentLocaleMessages[key].message
        : defaultLocaleMessages[key].message

    window.chrome.i18n.getMessage = getMessage
  }
}

export async function fetchLocale(localeCode) {
  try {
    const response = await getFetchWithTimeout(`./_locales/${localeCode}/messages.json`)
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch ${localeCode} locale because of ${error}`)
    return {}
  }
}
