const formatNumber = (number, maximumFractionDigits) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits }).format(number)

export default formatNumber
