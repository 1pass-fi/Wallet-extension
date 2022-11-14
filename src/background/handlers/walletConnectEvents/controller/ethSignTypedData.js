export default async (payload, metadata, next) => {
  try {
    console.log('personal sign')
    console.log('payload', payload)
    console.log('metadata', metadata)

    const exampleSignature = '0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c'
    /* TODO walletconnect: Implement sign typed data */
    next({ data: exampleSignature })
  } catch (err) {
    next({ error: err.message })
  }
}
