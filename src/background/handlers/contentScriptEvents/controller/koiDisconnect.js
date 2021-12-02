import storage from 'services/storage'


export default async (_, tab, next) => {
  try {
    const { hadPermission, siteAddressDictionary, origin } = tab

    if (!hadPermission) {
      next({ data: { status: 400, data: 'Do not have permissions.' } })
      return
    }

    delete siteAddressDictionary[origin]
    await storage.setting.set.siteAddressDictionary(siteAddressDictionary)

    next({ data: { status: 200, data: 'Disconnected.' } })
  } catch (err) {
    console.error(err.message)
    next({ data: { status: 500, data: 'Disconnect error' } })
  }
}
