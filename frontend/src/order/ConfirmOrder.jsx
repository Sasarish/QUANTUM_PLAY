import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { PageTitle } from '../Components/PageTitle'

const ConfirmOrder = () => {
    const { shippingInfo } = useSelector((state) => state.order);
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 5000 || itemsPrice === 0 ? 0 : 350;
    const taxPrice = Number((itemsPrice * 0.02).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    useEffect(() => {
        if (!shippingInfo?.address) navigate("/shipping");
    }, [shippingInfo, navigate]);

    const proceedToPaymentHandler = () => {
        navigate("/order/payment");
    };

    return (
        <>
            <PageTitle title="Quantum Play | Confirm Order" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto grid md:grid-cols-3 gap-6'>
                    <div className='md:col-span-2 space-y-6'>
                        <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                            <h3 className='font-bold text-gray-800 mb-3'>Shipping Info</h3>
                            <p className='text-sm text-gray-600'>Name: {user?.name}</p>
                            <p className='text-sm text-gray-600'>Phone: {shippingInfo?.phoneNo}</p>
                            <p className='text-sm text-gray-600'>
                                Address: {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.state}, {shippingInfo?.country} - {shippingInfo?.pinCode}
                            </p>
                        </div>

                        <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                            <h3 className='font-bold text-gray-800 mb-3'>Your Items</h3>
                            <div className='space-y-3'>
                                {cartItems.map((item) => (
                                    <div key={item.product} className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            <img src={item.image} alt={item.name} className='w-14 h-14 rounded-lg object-cover' />
                                            <Link to={`/product/${item.product}`} className='text-sm font-semibold text-gray-800 hover:underline'>{item.name}</Link>
                                        </div>
                                        <span className='text-sm text-gray-600'>{item.quantity} x LKR {item.price} = LKR {item.quantity * item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit'>
                        <h3 className='font-bold text-gray-800 mb-4'>Order Summary</h3>
                        <div className='space-y-2 text-sm text-gray-600'>
                            <div className='flex justify-between'><span>Subtotal</span><span>LKR {itemsPrice.toLocaleString()}</span></div>
                            <div className='flex justify-between'><span>Shipping</span><span>LKR {shippingPrice}</span></div>
                            <div className='flex justify-between'><span>Tax</span><span>LKR {taxPrice}</span></div>
                            <div className='border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900'>
                                <span>Total</span><span>LKR {totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={proceedToPaymentHandler}
                            className='w-full mt-6 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98]'
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmOrder