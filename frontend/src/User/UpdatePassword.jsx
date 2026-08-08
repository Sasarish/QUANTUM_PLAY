import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar"
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeErrors, removeSuccess, updatePassword } from '../features/user/userSlice';

const UpdatePassword = () => {

    const { error, success, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors())
        }

        if (success) {
            toast.success("Password updated successfully", { position: "top-center", autoClose: 3000 });
            dispatch(removeSuccess());
            navigate("/profile");
        }
    }, [dispatch, error, success, navigate]);

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New password and Confirm password do not match", { position: "top-center", autoClose: 3000 });
            return;
        }

        dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
    }

    return (
        <>
            <Navbar />

            <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-12 lg:px-8 pt-24'>

                <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-black drop-shadow-sm'>Update Password</h2>
                </div>

                <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                    <div className='bg-white py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100'>
                        <form
                            onSubmit={updatePasswordSubmit}
                            className='space-y-6'>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 ml-1'>Old Password</label>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder='Enter old password'
                                        className='appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 ml-1'>New Password</label>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='Enter new password'
                                        className='appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-gray-700 ml-1'>Confirm Password</label>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Enter confirm password '
                                        className='appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    className='w-full bg-gray-900 text-white py-3 px-4 rounded hover:bg-black active:scale-[0.98]'
                                >
                                    {loading ? "Please wait" : "Change Password"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdatePassword