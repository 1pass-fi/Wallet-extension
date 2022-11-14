export default async (payload, metadata, next) => {
  try {
    console.log('personal sign')
    console.log('payload', payload)
    console.log('metadata', metadata)

    const exampleSignature = '0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b'
    /* TODO walletconnect: Implement personal sign */
    next({ data: exampleSignature })
  } catch (err) {
    next({ error: err.message })
  }
}
