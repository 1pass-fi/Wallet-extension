import React from 'react'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './MainLayout.css'

import NavBar from 'finnie-v2/components/NavBar'
import Sidebar from 'finnie-v2/components/Sidebar'

const MainLayout = ({ title, children }) => {
  return (
    <div className="w-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
      <NavBar />
      <div className="w-full z-40 fixed top-16 h-18.75 bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800" />
      <div className="w-full 2xl:w-2/3 mx-auto">
        <div className="sticky top-16 z-40 bg-transparent text-white w-full text-3xl tracking-wider h-18.75 px-13.75 pt-7.25">
          {title.toUpperCase()}
        </div>
        <div className="px-4.25">
          <aside className="fixed z-51 w-61 pt-4">
            <Sidebar />
          </aside>
          <ReactNotification />
          <main className="ml-65.5 pb-5">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
