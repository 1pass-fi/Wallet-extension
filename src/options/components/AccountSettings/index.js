import React from 'react'

import AccountSettingsDark from './AccountSettingsDark'
import AccountSettingsLight from './AccountSettingsLight'

const AccountSettings = React.forwardRef(
  ({ className, type = 'dark', toggleDropdownMenu }, ref) => {
    if (type === 'light') {
      return (
        <AccountSettingsLight
          className={className}
          ref={ref}
          toggleDropdownMenu={toggleDropdownMenu}
        />
      )
    }

    return <AccountSettingsDark className={className} ref={ref} />
  }
)

export default AccountSettings
