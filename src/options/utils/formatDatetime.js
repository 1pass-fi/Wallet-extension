import moment from 'moment'

const MILI_SECOND = 1000

const formatDatetime = (rawDate) => moment(rawDate * MILI_SECOND).format('MMMM Do, YYYY')

export default formatDatetime
