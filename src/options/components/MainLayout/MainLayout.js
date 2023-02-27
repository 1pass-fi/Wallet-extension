import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from 'options/components/NavBar'
import Sidebar from 'options/components/Sidebar'

const MainLayout = ({ children }) => {
  const location = useLocation()

  const title = useMemo(() => {
    let title = ''
    switch (location.pathname) {
      case '/':
      case '/gallery':
        title = chrome.i18n.getMessage('gallery')
        break
      // case '/collections':
      //   title = 'Collections'
      //   break
      case '/collections/create.new-collection':
        title = chrome.i18n.getMessage('createCollection')
        break
      case '/collections/create/select-nft':
        title = chrome.i18n.getMessage('selectYourNFTs')
        break
      default:
        title = chrome.i18n.getMessage('gallery')
    }

    // if (location.pathname.includes('collections')) title = 'Collections'

    if (location.pathname.includes('notifications')) title = chrome.i18n.getMessage('notificationCenter')

    if (location.pathname.includes('settings')) title = chrome.i18n.getMessage('settings')

    if (location.pathname.includes('create-nft')) title = chrome.i18n.getMessage('gallery')

    return title
  }, [location.pathname])

  const renderWithoutLayoutPaths = [
    'welcome',
    'create-wallet',
    'upload-wallet',
    'import-wallet',
    'nfts'
  ]

  return (
    <>
      {renderWithoutLayoutPaths.every((path) => {
        return !location?.pathname?.includes(path)
      }) ? (
          <div className="w-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
            <NavBar />
            <div className="w-full z-40 fixed top-16 h-18.75 bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800" />
            <div className="w-full xl:w-5/6 mx-auto">
              <div className="sticky top-16 z-40 bg-transparent text-white text-3xl tracking-wider flex items-center justify-items-start h-18.75 ml-4.25">
                {title.toUpperCase()}
              </div>
              <div className="px-4.25">
                <aside className="fixed z-51 w-61 3xl:w-65.5 pt-4">
                  <Sidebar currentPath={location.pathname} />
                </aside>
                <main className="ml-72 xl:ml-77 2xl:ml-83 3xl:ml-90.5 pb-5">{children}</main>
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
