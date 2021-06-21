import numeral from 'numeral'

export const formatNumber = (value) => numeral(value).format('0,0.000000')
