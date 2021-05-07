import React from 'react'
import './card.css'

export default ({ children, className }) => {
    return (
        <div className={"card " + className}>
            {children}
        </div>
    )
}
