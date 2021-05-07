import React from 'react'
import './index.css'

export default ({ label, onClick }) => {
    return (
        <button onClick={onClick} className="button-shared">{label}</button>
    )
}
