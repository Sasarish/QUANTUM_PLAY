import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { PageTitle } from '../Components/PageTitle'
import CartItem from '../Components/CartItem'
import { ShoppingCart } from 'lucide-react'

const Cart = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate("/login");
    }, [isAuthenticated, navigate]);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <>
            <PageTitle title="Quantum Play | Cart" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto'>
                    <h2 className='text-3xl font-extrabold text-black mb-8 text-center'>Your Cart</h2>

                    {cartItems.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100'>
                            <ShoppingCart size={48} className='text-gray-300 mb-4' />
                            <p className='text-gray-500 mb-4'>Your cart is empty</p>
                            <Link to="/products" className='bg-gray-900 hover:bg-black text-white font-semibold py-2 px-6 rounded-xl transition-all'>
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className='space-y-4'>
                                {cartItems.map((item) => (
                                    <CartItem key={item.product} item={item} />
                                ))}
                            </div>

                            <div className='mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                                <div className='flex justify-between items-center text-lg font-bold text-gray-800 mb-4'>
                                    <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})</span>
                                    <span>LKR {itemsPrice.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => navigate("/shipping")}
                                    className='w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98]'
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Cart