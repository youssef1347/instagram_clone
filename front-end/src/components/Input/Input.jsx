import React from 'react'
import './Input.css'

export const Input = ({ placeholder, type, value, onChange, ref }) => {
    return (
        <div className="input-container">
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value}
                onChange={onChange}
                ref={ref}
            />
        </div>
    )
}
