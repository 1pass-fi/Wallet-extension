import React from 'react'
import { useLocation } from 'react-router-dom'

import NavBar from 'finnie-v2/components/NavBar'
import Sidebar from 'finnie-v2/components/Sidebar'


const MainLayout = ({ title, children }) => {
  const location = useLocation()
  const EXCLUDE_PATH = [
    '/success'
  ]

  return (
    <>
      {!EXCLUDE_PATH.includes(location.pathname) && !location.pathname.includes('nfts') ?
        <div className="w-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
          <NavBar />
          <div className="w-full z-40 fixed top-16 h-18.75 bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800" />
          <div className="w-full 2xl:w-5/6 mx-auto">
            <div className="sticky top-16 z-40 bg-transparent text-white w-61 text-3xl tracking-wider flex items-center justify-items-start h-18.75 ml-4.25">
              <div className='w-61 truncate'>{title.toUpperCase()}</div>
              
            </div>
            <div className="px-4.25">
              <aside className="fixed z-51 w-61 pt-4">
                <Sidebar />
              </aside>
              <main className="ml-65.5 pb-5">{children}</main>
            </div>
          </div>
        </div> :
        <div>{children}</div>
      }
    </>
  )
}

export default MainLayout
