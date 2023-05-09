import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import Button from 'options/components/Button'

const AddNetworkManuallyModal = ({ close }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    const handlePressingEsc = (event) => {
      if (event.defaultPrevented) {
        return // Should do nothing if the default action has been cancelled
      }

      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handlePressingEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handlePressingEsc)
    }
  }, [modalRef])

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {

    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '510px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          <div className="m-auto">Add Network Manually</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>

        <div className="mt-7.5 flex flex-col items-center justify-evenly">
          {/* Name of Network */}
          <div
            style={{ width: '382px' }}
            className="pl-1.75 mt-3 font-semibold text-sm leading-6"
          >
            Name of Network
          </div>
          <div className="relative">
            <input
              style={{ width: '382px', height: '28px' }}
              className={clsx(
                'text-base rounded-sm pl-2 pr-11 mt-1.5',
                'bg-trueGray-400 bg-opacity-50 border-b border-indigo border-opacity-80',
                'focus:text-success-700 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border focus:border-turquoiseBlue'
              )}
              onKeyDown={(e) => handleKeyDown(e)}
            ></input>
          </div>

          {/* New RPC URL */}
          <div
            style={{ width: '382px' }}
            className="pl-1.75 mt-3 font-semibold text-sm leading-6"
          >
            New RPC URL
          </div>
          <div className="relative">
            <input
              style={{ width: '382px', height: '28px' }}
              className={clsx(
                'text-base rounded-sm pl-2 pr-11 mt-1.5',
                'bg-trueGray-400 bg-opacity-50 border-b border-indigo border-opacity-80',
                'focus:text-success-700 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border focus:border-turquoiseBlue'
              )}
              onKeyDown={(e) => handleKeyDown(e)}
            ></input>
          </div>

          {/* Chain ID */}
          <div
            style={{ width: '382px' }}
            className="pl-1.75 mt-3 font-semibold text-sm leading-6"
          >
            Chain ID
          </div>
          <div className="relative">
            <input
              style={{ width: '382px', height: '28px' }}
              className={clsx(
                'text-base rounded-sm pl-2 pr-11 mt-1.5',
                'bg-trueGray-400 bg-opacity-50 border-b border-indigo border-opacity-80',
                'focus:text-success-700 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border focus:border-turquoiseBlue'
              )}
              onKeyDown={(e) => handleKeyDown(e)}
            ></input>
          </div>

          {/* Block Explorer URL (Optional) */}
          <div
            style={{ width: '382px' }}
            className="pl-1.75 mt-3 font-semibold text-sm leading-6"
          >
            Block Explorer URL (Optional)
          </div>
          <div className="relative">
            <input
              style={{ width: '382px', height: '28px' }}
              className={clsx(
                'text-base rounded-sm pl-2 pr-11 mt-1.5',
                'bg-trueGray-400 bg-opacity-50 border-b border-indigo border-opacity-80',
                'focus:text-success-700 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border focus:border-turquoiseBlue'
              )}
              onKeyDown={(e) => handleKeyDown(e)}
            ></input>
          </div>

          {/* Save Changes */}
          <Button
            style={{ width: '239px', height: '39px' }}
            className="h-10 mt-5 text-base rounded w-43.75 mx-auto mb-5"
            variant="indigo"
            text='Save Changes'
          />
        </div>
      </div>
    </div>
  )
}

export default AddNetworkManuallyModal
