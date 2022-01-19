const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

export default (style) => {
  const keys = Object.keys(style)
  const _style = {}

  for (const key of keys) {
    _style['.' + key] = style[key]
  }

  for (const key of Object.keys(_style)) {
    const attributes = {}
    const children = {}

    const classs = {..._style[key]}
    
    const listOfAttributes = Object.keys(classs)
    for (const attr of listOfAttributes) {
      const camel = camelToSnakeCase(attr)
      const value = classs[attr]
      classs[camel] = value

      if (attr !== camel) delete classs[attr]
    }

    _style[key]['attributes'] = classs
    _style[key]['children'] = children
  }

  return _style
}
