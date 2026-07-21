import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import e from 'express';

const UpdateProfile = () => {

    const { user, error, success, loading } = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [preview, setPreview] = useState("../src/assets/profile.jpg");

    //assigning current user details
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);

            if (user.avatar?.url) {
                setPreview(user.avatar.url);
            }
        }
    }, [user]);

    //assigning selected photo to statevariable avatar, preview
    const handleChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState == 2) {
                setPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    //submiting updated user details to db
    const updateProfileSubmit = () => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        if (avatar) {
            myForm.set("avatar", avatar);
        }
    }

    return (
        <>
            <Navbar />

            <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8 pt-24'>
                <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-black'>
                        Update Profile
                    </h2>
                </div>

                <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                    <div className='bg-white py-10 px-6 shadow-sm rounded sm:px-10 border border-gray-100'>

                        <form
                            encType='multipart/form-data'
                            className='space-y-6'
                            onSubmit={updateProfileSubmit}>
                            <div className='flex flex-col items-center mb-6'>

                                <div className='w-28 h-28 mb-4'>
                                    <img src={preview}
                                        alt=""
                                        className='rounded-full w-full h-full object-cover border-4 border-gray-100 shadow-sm'
                                    />
                                </div>
                                <label
                                    className='block bg-gray-50 text-gray-700 px-2 py-4  rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-100 transition'
                                >
                                    ChangePhoto
                                    <input
                                        type="file"
                                        name='avatar'
                                        className='hidden'
                                        onChange={handleChange}
                                        accept='image/*' />
                                </label>
                            </div>

                            <div className='mt-1'>
                                <label htmlFor="name"
                                    className='block text-sm font-semibold text-gray-700 ml-1'
                                >
                                    Name
                                </label>
                                <div className='mt-1'>
                                    <input
                                        type="text"
                                        id='name'
                                        name='name'
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className='appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                                    />
                                </div>
                            </div>

                            <div className='mt-1'>
                                <label htmlFor="name"
                                    className='block text-sm font-semibold text-gray-700 ml-1'
                                >
                                    Email address
                                </label>
                                <div className='mt-1'>
                                    <input
                                        type="email"
                                        id='email'
                                        name='email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                                    />
                                </div>
                            </div>

                            <div className='pt-2'>
                                <button
                                    type='submit'
                                    className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-gray-200 text-sm font-bold text-white bg-gray-800 hover:bg-black active:scale-[0.98]'
                                >
                                    Update Details
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateProfile