import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar"
import { PageTitle } from "../Components/PageTitle"
import toast from "react-hot-toast"
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice'

const ResetPassword = () => {

    const { error, loading, success, message } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        };
        if (success) {
            toast.success("Password reset successfully", { position: "top-center", autoClose: 3000 });
            dispatch(removeSuccess());
            navigate("/login")
        }
    },[dispatch, error, success])

    //Handling the resetPassword
    const resetPasswordSubmit = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match", { position: "top-center", autoClose: 3000 });
            return;
        }

        const data = {
            password,
            confirmPassword,
        }

        //calling resetpassword function from userslice
        dispatch(resetPassword({ token, userData: data }));
    }

    return (
        <>
            <Navbar />
            <PageTitle title="Reset Password" />

            <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8 pt-24'>

                <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-black drop-shadow-sm'>
                        Reset Password
                    </h2>
                </div>

                <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                    <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                        <form className='space-y-6' onSubmit={resetPasswordSubmit}>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 ml-1'>
                                    New Password
                                </label>
                                <div className='mt-1'>
                                    <input
                                        type="password"
                                        name='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Enter your new password'
                                        className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 ml-1'>
                                    Confirm New Password
                                </label>
                                <div className='mt-1'>
                                    <input
                                        type="password"
                                        name='confirmPassword'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Enter your confirm new password'
                                        className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all'
                                    />
                                </div>
                            </div>

                            <button
                                className='w-full bg-gray-800 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98]'
                            >
                                Reset Password
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ResetPassword