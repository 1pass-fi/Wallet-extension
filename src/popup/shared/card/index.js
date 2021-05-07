import React from 'react'
import './index.css'

export default ({ children, className }) => {
    return (
        <div className={"card " + className}>
            {children}
        </div>
    )
}
