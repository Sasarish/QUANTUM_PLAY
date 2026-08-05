import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { PageTitle } from '../Components/PageTitle'
import { saveShippingInfo } from '../features/order/orderSlice'

const Shipping = () => {
    const { shippingInfo } = useSelector((state) => state.order);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingInfo?.address || "");
    const [city, setCity] = useState(shippingInfo?.city || "");
    const [state, setState] = useState(shippingInfo?.state || "");
    const [country, setCountry] = useState(shippingInfo?.country || "Sri Lanka");
    const [pinCode, setPinCode] = useState(shippingInfo?.pinCode || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || "");

    const submitHandler = (e) => {
        e.preventDefault();
        if (cartItems.length === 0) { navigate("/cart"); return; }
        dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo }));
        navigate("/order/confirm");
    };

    return (
        <>
            <PageTitle title="Quantum Play | Shipping" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 pt-24'>
                <div className='w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl'>
                    <h2 className='text-2xl font-extrabold text-slate-800 mb-6 text-center'>Shipping Details</h2>
                    <form onSubmit={submitHandler} className='space-y-4'>
                        <div>
                            <label className='text-sm font-medium text-gray-700 ml-1 block'>Address</label>
                            <input required value={address} onChange={(e) => setAddress(e.target.value)}
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='text-sm font-medium text-gray-700 ml-1 block'>City</label>
                                <input required value={city} onChange={(e) => setCity(e.target.value)}
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-700 ml-1 block'>State/Province</label>
                                <input required value={state} onChange={(e) => setState(e.target.value)}
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='text-sm font-medium text-gray-700 ml-1 block'>Country</label>
                                <input required value={country} onChange={(e) => setCountry(e.target.value)}
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-700 ml-1 block'>Pin Code</label>
                                <input required type="number" value={pinCode} onChange={(e) => setPinCode(e.target.value)}
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                            </div>
                        </div>
                        <div>
                            <label className='text-sm font-medium text-gray-700 ml-1 block'>Phone Number</label>
                            <input required type="number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)}
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                        </div>
                        <button className='w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98]'>
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Shipping