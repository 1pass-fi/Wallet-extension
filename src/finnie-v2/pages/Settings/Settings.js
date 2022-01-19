import React from 'react'

import MainLayout from 'finnie-v2/components/MainLayout'

import SettingsV1 from 'options/pages/Settings'

const Settings = () => {
  return (
    <MainLayout title="Settings">
      <div className="transform flex justify-start">
        <SettingsV1 />
      </div>
    </MainLayout>
  )
}

export default Settings
