import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../Components/Navbar'
import Loader from '../Components/Loader'
import { PageTitle } from '../Components/PageTitle'
import { getOrderDetails, updateOrder, deleteOrder, removeErrors, resetOrderState } from '../features/order/orderSlice'
import { formatDate } from '../utils/formatter'

const statusOptions = ["processing", "Shipped", "Delivered"];

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { order, loading, error, isUpdated, isDeleted } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getOrderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (isUpdated) {
            toast.success("Order status updated", { position: "top-center", autoClose: 2000 });
            dispatch(resetOrderState());
            dispatch(getOrderDetails(id));
        }
        if (isDeleted) {
            toast.success("Order deleted", { position: "top-center", autoClose: 2000 });
            dispatch(resetOrderState());
            navigate("/admin/orders");
        }
    }, [error, isUpdated, isDeleted, dispatch, id, navigate]);

    const statusChangeHandler = (status) => {
        dispatch(updateOrder({ id, status }));
    };

    const deleteHandler = () => {
        if (window.confirm("Delete this order? This cannot be undone.")) {
            dispatch(deleteOrder(id));
        }
    };

    return loading || !order ? <Loader /> : (
        <>
            <PageTitle title="Quantum Play | Admin - Order Details" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto space-y-6'>
                    <div className='flex items-center justify-between'>
                        <Link to="/admin/orders" className='flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black'>
                            <ArrowLeft size={16} /> Back to All Orders
                        </Link>
                        <button
                            onClick={deleteHandler}
                            className='flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700'
                        >
                            <Trash2 size={16} /> Delete Order
                        </button>
                    </div>

                    <h2 className='text-2xl font-extrabold text-black'>Order #{order._id}</h2>

                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                        <h3 className='font-bold text-gray-800 mb-3'>Status</h3>
                        <div className='flex items-center gap-4'>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.orderStatus === "Delivered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                {order.orderStatus}
                            </span>
                            <select
                                value={order.orderStatus}
                                onChange={(e) => statusChangeHandler(e.target.value)}
                                className='border border-gray-200 rounded-lg px-3 py-1.5 text-sm'
                            >
                                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <p className='text-sm text-gray-500 mt-3'>Placed on {formatDate(order.createdAt)}</p>
                    </div>

                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                        <h3 className='font-bold text-gray-800 mb-2'>Customer</h3>
                        <p className='text-sm text-gray-600'>Name: {order.user?.name}</p>
                        <p className='text-sm text-gray-600'>Email: {order.user?.email}</p>
                    </div>

                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                        <h3 className='font-bold text-gray-800 mb-2'>Shipping Address</h3>
                        <p className='text-sm text-gray-600'>
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, {order.shippingAddress?.country} - {order.shippingAddress?.pinCode}
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>Phone: {order.shippingAddress?.phoneNo}</p>
                    </div>

                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                        <h3 className='font-bold text-gray-800 mb-3'>Items</h3>
                        <div className='space-y-3'>
                            {order.orderItems?.map((item) => (
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

                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                        <h3 className='font-bold text-gray-800 mb-2'>Payment</h3>
                        <p className='text-sm text-gray-600'>Payment ID: {order.paymentInfo?.id}</p>
                        <p className='text-sm text-gray-600'>Status: {order.paymentInfo?.status}</p>
                        <p className='text-sm text-gray-600 mt-2'>Subtotal: LKR {order.itemPrice}</p>
                        <p className='text-sm text-gray-600'>Shipping: LKR {order.shippingPrice}</p>
                        <p className='text-sm text-gray-600'>Tax: LKR {order.taxPrice}</p>
                        <p className='text-sm font-bold text-gray-900 mt-1'>Total: LKR {order.totalPrice}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminOrderDetails