import React from 'react'

import NavBar from 'finnie-v2/components/NavBar'

const MainLayout = ({ title, children }) => {
  return (
    <div className="w-full min-h-screen h-full bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800">
      <NavBar />
      <div className="sticky top-16 z-50 bg-gradient-to-r from-blueGray-900 to-indigo via-indigo-800 text-white w-full text-3xl tracking-wider h-18.75 px-13.75 pt-7.25">
        {title.toUpperCase()}
      </div>

      <div className="flex justify-center">
        <main className="px-20 lg:px-40">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
