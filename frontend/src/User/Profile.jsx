import React, { useEffect } from 'react'
import Navbar from "../Components/Navbar"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

const Profile = () => {

    const { user, isAuthenticated, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <Navbar />

            <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8 pt-24 '>
                <div className='sm:mx-auto sm:w-full sm:max-m-md'>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-black'> My Profile</h2>
                </div>

                <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-xl'>
                    <div className='bg-white py-10 px-6 shadow-sm rounded sm:px-12 flex flex-col items-center border border-gray-100'>
                        <div className=' w-36 h-36 mb-8 mt-2'>
                            <img
                                src={user?.avatar?.url}
                                alt={user?.name}
                                title={user?.name}
                                className='rounded-full w-full h-full object-cover border-4 border-gray-100 shadow-l '
                            />
                        </div>

                        <div className='w-full space-y-6'>
                            <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                                <h4 className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1'>
                                    Full Name
                                </h4>
                                <p className='text-xl font-bold text-gray-800 capitalize'>
                                    {user?.name}
                                </p>
                            </div>

                            <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                                <h4 className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1'>
                                    Email Address
                                </h4>
                                <p className='text-xl font-bold text-gray-800'>
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className='w-full mt-8 flex gap-4 flex-col sm:flex-row'>
                            <Link
                                to="/profile/update"
                                className='w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-md shadow-gray-200 text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all active:scale-[0.98]'
                            >
                                Edit Profile
                            </Link>
                            <Link
                                to="/password/update"
                                className='w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-md shadow-gray-200 text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all active:scale-[0.98]'
                            >
                                Change Password
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile