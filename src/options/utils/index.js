import numeral from 'numeral'

export const formatNumber = (value, decimal) => {
  const zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  return numeral(value).format(decimal ? `0,0.${zeroArray.slice(0, decimal).join('')}` : '0,0.00')
}
