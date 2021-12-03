import React from 'react'

import NavBar from 'finnie-v2/components/NavBar'

const MainLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div>{children}</div>
    </>
  )
}

export default MainLayout
