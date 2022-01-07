const { toJSON } = require('cssjson')
const camelCase = require('camelcase')
const classes = [
  'description', 
  'name', 
  'links', 
  'background',
  'content-area',
  'wallet-address',
  'did-label',
  'address-name',
  'address-value',
  'show-address-button',
]

export default (css) => {
  var json = toJSON(css)
  json = json.children
  // return json
  let keys = Object.keys(json)
  let data = {}

  for (let key of keys) {

    let e = json[key]['attributes']
    let attributes = Object.keys(e)
    let newAttributes = {}
    for (let attribute of attributes) {
      newAttributes[camelCase(attribute)] = e[attribute]
    }
    
    key = key.split('.')[1] || undefined
    console.log(key)
    if (key && classes.includes(key))
      data[key] = newAttributes
  }

  return data
}

// new function - will take a look
function parseCSS(css) {
  var json = toJSON(css)
  json = json.children
  // return json
  let keys = Object.keys(json)
  let data = {}

  for (let key of keys) {

    let e = json[key]['attributes']
    let attributes = Object.keys(e)
    let newAttributes = {}
    for (let attribute of attributes) {
      newAttributes[camelCase(attribute)] = e[attribute]
    }
    
    key = key.split('.')[1] || undefined
    console.log(key)
    if(key)
      data[key] = newAttributes
  }

  return data
}
