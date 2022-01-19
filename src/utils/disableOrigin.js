import storage from 'services/storage'

const REMOVE = 'REMOVE'
const ADD = 'ADD'
const REMOVE_ALL = 'REMOVE_ALL'

const handleChangeDisabledOrigin = (action) => async (origin) => {
  let disabledOrigins = await storage.setting.get.disabledOrigins()
  const originExisting = disabledOrigins.includes(origin)

  switch (action) {
    case ADD:
      if (!originExisting) {
        disabledOrigins.push(origin)
      }
      break
    case REMOVE:
      if (originExisting) {
        disabledOrigins = disabledOrigins.filter(o => o !== origin)
      }
      break

    case REMOVE_ALL:
      disabledOrigins = []
      break
  }
  await storage.setting.set.disabledOrigin(disabledOrigins)
}


export default {
  addDisabledOrigin: handleChangeDisabledOrigin(ADD),
  removeDisabledOrigin: handleChangeDisabledOrigin(REMOVE),
  removeAllDisabledOrigins: handleChangeDisabledOrigin(REMOVE_ALL)
}
