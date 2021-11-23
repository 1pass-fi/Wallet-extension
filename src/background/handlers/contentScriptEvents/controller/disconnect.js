import storage from 'services/storage'


export default async (_, tab, next) => {
  try {
    const { hadPermission, siteAddressDictionary, origin } = tab

    if (hadPermission) {
      delete siteAddressDictionary[origin]
      await storage.setting.set.siteAddressDictionary(siteAddressDictionary)
    }

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Disconnect error' })
  }
}
