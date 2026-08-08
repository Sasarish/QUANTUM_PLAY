import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CheckCircle2 } from 'lucide-react'
import Navbar from '../Components/Navbar'
import { PageTitle } from '../Components/PageTitle'
import { resetOrderState } from '../features/order/orderSlice'

const OrderSuccess = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetOrderState());
    }, [dispatch]);

    return (
        <>
            <PageTitle title="Quantum Play | Order Placed" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-24'>
                <CheckCircle2 size={64} className='text-green-500 mb-4' />
                <h2 className='text-2xl font-extrabold text-gray-800 mb-2'>Order Placed Successfully!</h2>
                <p className='text-gray-500 mb-6'>Thank you for your purchase. We'll notify you once it ships.</p>
                <Link to="/orders" className='bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-xl transition-all'>
                    View My Orders
                </Link>
            </div>
        </>
    )
}

export default OrderSuccess