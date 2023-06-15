const checkFileExists = async (relativePath) => {
  try {
    const response = await fetch(relativePath)
    return response.status !== 404
  } catch (err) {
    console.error(err)
    return false
  }
}

export default checkFileExists
