import React from 'react'

const Loader = () => {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='h-10 w-10 border-4 border-gray-500 rounded-full border-t-transparent animate-spin'>
                <span className='sr-only'>Loading....</span>
            </div>
        </div>
    )
}

export default Loader