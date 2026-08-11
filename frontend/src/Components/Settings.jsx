import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { User, Pencil, Lock, Package, ChevronRight } from 'lucide-react'
import Navbar from './Navbar'
import { PageTitle } from './PageTitle'

const Settings = () => {
    const { user } = useSelector((state) => state.user);
    const isAdmin = user?.role === "admin";

    const options = [
        {
            icon: User,
            title: "My Profile",
            description: "View your account details",
            to: "/profile",
        },
        {
            icon: Pencil,
            title: "Edit Profile",
            description: "Update your name, email, and photo",
            to: "/profile/update",
        },
        {
            icon: Lock,
            title: "Change Password",
            description: "Update your account password",
            to: "/password/update",
        },
        {
            icon: Package,
            title: isAdmin ? "Orders" : "My Orders",
            description: isAdmin ? "View and manage all customer orders" : "Track and view your past orders",
            to: isAdmin ? "/admin/orders" : "/orders",
        },
    ];

    return (
        <>
            <PageTitle title="Quantum Play | Settings" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-2xl mx-auto'>
                    <h2 className='text-3xl font-extrabold text-black mb-8 text-center'>Settings</h2>

                    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden'>
                        {options.map((option) => (
                            <Link
                                key={option.title}
                                to={option.to}
                                className='flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors'
                            >
                                <div className='w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0'>
                                    <option.icon size={20} className='text-gray-700' />
                                </div>
                                <div className='flex-1'>
                                    <h3 className='font-bold text-gray-900'>{option.title}</h3>
                                    <p className='text-sm text-gray-500'>{option.description}</p>
                                </div>
                                <ChevronRight size={20} className='text-gray-300' />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings