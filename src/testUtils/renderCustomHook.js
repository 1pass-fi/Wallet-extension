import { act, renderHook } from '@testing-library/react-hooks'

const renderCustomHook = async (hook, ...args) => {
  let result

  await act(async () => {
    result = renderHook(() => hook(...args)).result
  })

  return result
}

export default renderCustomHook
