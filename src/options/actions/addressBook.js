import { HIDE_ADDRESS_BOOK,SHOW_ADDRESS_BOOK } from './types'

export const showAddressBook = () => {
  return {
    type: SHOW_ADDRESS_BOOK
  }
}

export const hideAddressBook = () => {
  return {
    type: HIDE_ADDRESS_BOOK
  }
}
