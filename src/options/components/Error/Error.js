import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearError } from 'options/actions/error'
import Message from 'options/components/Message'

const Error = () => {
  const dispatch = useDispatch()
  const error = useSelector((state) => state.error)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (error) return <Message children={error} />
  return ''
}

export default Error
