const getJsonFromFile = (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = function (e) {
        const fileContents = e.target.result
        const jsonData = JSON.parse(fileContents)
        resolve(jsonData)
      }

      reader.readAsText(file)
    }) 
  } catch (err) {
    console.error(err)
    return null
  }
}

export default getJsonFromFile
