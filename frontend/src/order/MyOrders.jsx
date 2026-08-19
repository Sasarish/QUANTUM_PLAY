import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Loader from '../Components/Loader'
import { PageTitle } from '../Components/PageTitle'
import { myOrders, removeErrors } from '../features/order/orderSlice'
import { formatDate } from '../utils/formatter'
import toast from 'react-hot-toast'

const MyOrders = () => {
    const { orders, loading, error } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    //Calling the myOrders function from Orderslice
    useEffect(() => { dispatch(myOrders()); }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [error, dispatch]);

    return loading ? <Loader /> : (
        <>
            <PageTitle title="Quantum Play | My Orders" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto'>
                    <h2 className='text-3xl font-extrabold text-black mb-8 text-center'>My Orders</h2>
                    {orders.length === 0 ? (
                        <p className='text-center text-gray-500'>You haven't placed any orders yet.</p>
                    ) : (
                        <div className='space-y-4'>
                            {orders.map((order) => (
                                <Link to={`/order/${order._id}`} key={order._id}
                                    className='block bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition'>
                                    <div className='flex flex-wrap justify-between items-center gap-2'>
                                        <div>
                                            <p className='text-xs text-gray-400 uppercase font-semibold'>Order ID</p>
                                            <p className='text-sm font-semibold text-gray-800'>{order._id}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400 uppercase font-semibold'>Placed On</p>
                                            <p className='text-sm text-gray-700'>{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400 uppercase font-semibold'>Status</p>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.orderStatus === "Delivered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400 uppercase font-semibold'>Total</p>
                                            <p className='text-sm font-bold text-gray-900'>LKR {order.totalPrice}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MyOrders