const formatNumber = (number, maximumFractionDigits = undefined) => {
  let options = {}

  if (typeof maximumFractionDigits === 'number') {
    options.maximumFractionDigits = maximumFractionDigits
  } else {
    if (number >= 10) {
      options.maximumFractionDigits = 2
    } else if (number >= 1) {
      options.maximumFractionDigits = 1
    } else {
      options.maximumFractionDigits = 0
    }
  }

  return new Intl.NumberFormat('en-US', options).format(number)
}

export default formatNumber
