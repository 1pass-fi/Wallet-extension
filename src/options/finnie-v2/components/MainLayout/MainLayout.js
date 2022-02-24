import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import NavBar from 'finnie-v2/components/NavBar'
import Sidebar from 'finnie-v2/components/Sidebar'

const MainLayout = ({ children }) => {
  const location = useLocation()

  const title = useMemo(() => {
    let title = ''
    switch (location.pathname) {
      case '/':
      case '/gallery':
        title = 'Gallery'
        break
      case '/collections':
        title = 'Collections'
        break
      case '/collections/create.new-collection':
        title = 'Create Collection'
        break
      case '/collections/create/select-nft':
        title = 'Select your NFTs'
        break
      default:
        title = ''
    }

    if (location.pathname.includes('collections')) title = 'Collections'

    if (location.pathname.includes('notifications')) title = 'Notification Center'

    if (location.pathname.includes('settings')) title = 'Settings'

    if (location.pathname.includes('create-nft')) title = 'Gallery'

    return title
  }, [location.pathname])

  const EXCLUDE_PATH = ['/success']

  return (
    <>
      {!EXCLUDE_PATH.includes(location.pathname) && !location.pathname.includes('nfts') ? (
        <div className="w-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
          <NavBar />
          <div className="w-full z-40 fixed top-16 h-18.75 bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800" />
          <div className="w-full 2xl:w-5/6 mx-auto">
            <div className="sticky top-16 z-40 bg-transparent text-white text-3xl tracking-wider flex items-center justify-items-start h-18.75 ml-4.25">
              {title.toUpperCase()}
            </div>
            <div className="px-4.25">
              <aside className="fixed z-51 w-61 pt-4">
                <Sidebar />
              </aside>
              <main className="ml-65.5 pb-5">{children}</main>
            </div>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  )
}

export default MainLayout