import React from 'react'
import toast from "react-hot-toast"
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { PageTitle } from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import CartItem from '../Components/CartItem'
import { Trash2 } from 'lucide-react'
import { clearCart } from '../features/cart/cartSlice'

const Cart = () => {

    const dispatch = useDispatch();

    const { success, loading, error, message, cartItems } = useSelector((state) => state.cart);
    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subTotal * 0.18;
    const shippingCharges = cartItems.length === 0 ? 0 : subTotal > 500 ? 500 : 0;
    const total = subTotal + tax + shippingCharges;

    return (

        <>
            <PageTitle title="Your Cart" />
            <Navbar />

            <main className='pt-20 pb-10 min-h-screen'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                        {/*Cart Details */}
                        <div className='lg:col-span-2'>

                            <div className='bg-white rounded-2xl shadow-lg p-6'>
                                <h2 className='text-2xl font-bold text-black mb-6 flex justify-between'>
                                    Your Cart
                                    <button
                                        className='text-red-500 hover:text-red-700 transition-colors flex items-center text-sm'
                                        onClick={() => dispatch(clearCart())}
                                    >
                                        <Trash2 /> Clear cart
                                    </button>
                                </h2>

                                <div className='space-y-4'>
                                    {cartItems.length === 0 ? (
                                        <div className='text-center py-12'>
                                            <p className='text-gray-500'>Your cart is empty</p>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => <CartItem item={item} key={item.product} />)
                                    )}
                                </div>
                            </div>

                        </div>

                        {/*Amount Details */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white rounded-2xl shadow-lg p-6 sticky top-24'>
                                <h2 className='text-2xl font-bold text-black mb-6'>Order Summary</h2>
                                <div className='space-y-4'>

                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Subtotal</span>
                                        <span className='font-bold'>LKR {subTotal.toFixed(2)}</span>
                                    </div>

                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Shipping</span>
                                        <span className='font-bold'>LKR {shippingCharges.toFixed(2)}</span>
                                    </div>

                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Tax 18%</span>
                                        <span className='font-bold'>LKR {tax.toFixed(2)}</span>
                                    </div>

                                    <div className='border-t border-gray-200 pt-4'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-800 text-xl font-bold'>Total</span>
                                            <span className='font-bold text-xl text-amber-600'>LKR {total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                </div>
                                <button
                                    className='w-full bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-black transition mt-5'
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default Cart