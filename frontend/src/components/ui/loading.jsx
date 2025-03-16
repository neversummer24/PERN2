import React from 'react'
import {FaSpinner} from 'react-icons/fa'

const Loading = () => {
    return (
        <div className = "w-full flex items-center justify-center py-2">
            <FaSpinner className="text-violet-600 animate-spin" size={30} />
        </div>
    ) ;   
}  ; 

export default Loading;