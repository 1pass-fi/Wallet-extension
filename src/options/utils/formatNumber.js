const formatNumber = (number, maximumFractionDigits) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(number)

export default formatNumber
