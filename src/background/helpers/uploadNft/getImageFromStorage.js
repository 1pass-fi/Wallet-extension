import storage from 'services/storage'

export default async (fileType) => {
  try {
    let { bitObject, imageId } = await storage.generic.get.nftBitData()

    if (!bitObject) return
    // parse the JSON string on local storage
    bitObject = JSON.parse(bitObject)

    // create 8 bit array from bit object
    const u8 = Uint8Array.from(Object.values(bitObject))

    // create blob from u8
    const blob = new Blob([u8], { type: 'contentType'})
   
    // create file from blob
    const file = new File([blob], 'filename', { type: fileType })

    return { u8, file, imageId }
  } catch (err) {
    throw new Error(err.message)
  }
}
