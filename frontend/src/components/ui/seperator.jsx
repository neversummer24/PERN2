import React from 'react'

export const Seperator = () => {
    return (
        <div className = "realative">
            <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
            </div>
        </div>
    )
}