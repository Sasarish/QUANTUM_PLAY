import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from '../Components/Navbar'
import Loader from '../Components/Loader'
import { PageTitle } from '../Components/PageTitle'
import { getAllOrdersByAdmin, updateOrder, deleteOrder, removeErrors, resetOrderState } from '../features/order/orderSlice'
import toast from 'react-hot-toast'

const statusOptions = ["processing", "Shipped", "Delivered"];

const AdminOrders = () => {
    const { orders, loading, error, totalAmount, isUpdated, isDeleted } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => { dispatch(getAllOrdersByAdmin()); }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (isUpdated) {
            toast.success("Order status updated", { position: "top-center", autoClose: 2000 });
            dispatch(resetOrderState());
            dispatch(getAllOrdersByAdmin());
        }
        if (isDeleted) {
            toast.success("Order deleted", { position: "top-center", autoClose: 2000 });
            dispatch(resetOrderState());
            dispatch(getAllOrdersByAdmin());
        }
    }, [error, isUpdated, isDeleted, dispatch]);

    const statusChangeHandler = (id, status) => dispatch(updateOrder({ id, status }));
    const deleteHandler = (id) => { if (window.confirm("Delete this order?")) dispatch(deleteOrder(id)); };

    return loading ? <Loader /> : (
        <>
            <PageTitle title="Quantum Play | Admin - Orders" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-6xl mx-auto'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-extrabold text-black'>All Orders</h2>
                        <p className='text-sm font-semibold text-gray-600'>Total Revenue: LKR {totalAmount?.toLocaleString()}</p>
                    </div>

                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-gray-100 text-gray-600 uppercase text-xs'>
                                <tr>
                                    <th className='p-3 text-left'>Order ID</th>
                                    <th className='p-3 text-left'>Customer</th>
                                    <th className='p-3 text-left'>Items</th>
                                    <th className='p-3 text-left'>Total</th>
                                    <th className='p-3 text-left'>Status</th>
                                    <th className='p-3 text-left'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className='border-t border-gray-100'>
                                        <td className='p-3 font-mono text-xs'>{order._id}</td>
                                        <td className='p-3'>{order.user?.name}<br /><span className='text-gray-400 text-xs'>{order.user?.email}</span></td>
                                        <td className='p-3'>{order.orderItems?.length}</td>
                                        <td className='p-3 font-semibold'>LKR {order.totalPrice}</td>
                                        <td className='p-3'>
                                            <select value={order.orderStatus} onChange={(e) => statusChangeHandler(order._id, e.target.value)}
                                                className='border border-gray-200 rounded-lg px-2 py-1 text-xs'>
                                                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className='p-3'>
                                            <button onClick={() => deleteHandler(order._id)} className='text-red-500 hover:text-red-700 text-xs font-semibold'>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminOrders