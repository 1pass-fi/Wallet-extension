import { popupBackgroundRequest as request } from 'services/request/popup'

export default async (address = null) => {
  await request.gallery.loadFriendReferralData(address)
}
