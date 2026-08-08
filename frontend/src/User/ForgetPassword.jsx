import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar"
import { PageTitle } from "../Components/PageTitle"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { forgetPassword, removeErrors, removeSuccess } from '../features/user/userSlice'
import toast from "react-hot-toast"

const ForgetPassword = () => {

    const { error, loading, success, message } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success(message, { position: "top-center", autoClose: 3000 });
            dispatch(removeSuccess());
        }
    }, [dispatch, error, success]);

    const forgetPasswordSubmit = (e) => {
        e.preventDefault();
        dispatch(forgetPassword({ email }));
        setEmail("");
    };

    return (
        <>
            <Navbar />
            <PageTitle title="Forgot Password" />

            <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8 pt-24'>
                <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-black drop-shadow-sm'>
                        Forget Password
                    </h2>
                </div>

                <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                    <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                        <form className='space-y-6' onSubmit={forgetPasswordSubmit}>
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 ml-1'>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder='hello@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all'
                                />
                            </div>
                            <button
                                className='w-full bg-gray-800 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98]'
                            >
                                Send reset Link
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ForgetPassword