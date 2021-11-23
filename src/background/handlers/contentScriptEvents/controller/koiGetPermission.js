export default async (_, tab, next) => {
  try {
    const { hadPermission } = tab

    if (hadPermission) {
      next({
        data: { status: 200, data: [
          'SIGN_TRANSACTION', 
          'ACCESS_ADDRESS', 
          'ACCESS_PUBLIC_KEY',
          'ACCESS_ALL_ADDRESSES',
          'ENCRYPT',
          'DECRYPT',
          'SIGNATURE',
          'ACCESS_ARWEAVE_CONFIG'
        ] }
      })
    } else {
      next({ data: { status: 401, data: [] } })
    }
  } catch (err) {
    console.error(err.message)
    next({ data: { status: 500, data: 'Get permissions error' } })
  }
}
