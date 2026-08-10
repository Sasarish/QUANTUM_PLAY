import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import Navbar from '../Components/Navbar'
import { PageTitle } from '../Components/PageTitle'

const OrderFail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message || "Something went wrong while processing your payment.";

    return (
        <>
            <PageTitle title="Quantum Play | Payment Failed" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-24 text-center'>
                <XCircle size={64} className='text-red-500 mb-4' />
                <h2 className='text-2xl font-extrabold text-gray-800 mb-2'>Payment Failed</h2>
                <p className='text-gray-500 mb-6 max-w-md'>{message}</p>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <button
                        onClick={() => navigate("/order/payment")}
                        className='bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-xl transition-all'
                    >
                        Try Again
                    </button>
                    <Link to="/cart" className='bg-white border border-gray-200 hover:border-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-xl transition-all'>
                        Back to Cart
                    </Link>
                </div>
            </div>
        </>
    )
}

export default OrderFail