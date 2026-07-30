import React, { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { addToCartItem, removeErrors, removeItemFromCart } from '../features/cart/cartSlice';

const CartItem = ({ item }) => {

    const [quantity, setQuantity] = useState(item.quantity);
    const dispatch = useDispatch();

    //Increasing product quantity
    const increaseQuantity = () => {
        if (item.stock <= quantity) {
            toast.error("Cannot exceed available stock!", { position: "top-center", autoClose: 3000, });
            dispatch(removeErrors());
            return;
        }
        const newQty = quantity + 1;
        setQuantity(newQty);
        dispatch(addToCartItem({ id: item.product, quantity: newQty }))

    };

    //Decreasing product quantity
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error("Quantity cannot be less than 1", { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        const newQty = quantity - 1;
        setQuantity(newQty);
        dispatch(addToCartItem({ id: item.product, quantity: newQty }))
    };

    return (
        <div
            key={item._id}
            className='flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50'
        >
            <img
                className='w-20 h-20 rounded-lg object-cover'
                src={item?.image}
                alt={item?.name} />
            <div className='flex-1'>
                <h3 className='font-bold text-slate-800'>{item?.name}</h3>
                <p className='font-bold text-amber-600 mt-2'>LKR {item?.price}</p>
                <p className='text-sm text-gray-500'>
                    LKR {item?.price} x {item?.quantity} = LKR {item?.price * item?.quantity}
                </p>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors'
                    onClick={decreaseQuantity}
                >
                    <Minus />
                </button>
                <span className='w-8 text-center font-bold'>{item?.quantity}</span>
                <button
                    className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors'
                    onClick={increaseQuantity}
                >
                    <Plus />
                </button>
            </div>

            <button
                className='text-red-500 hover:text-red-700 transition-colors'
                onClick={() =>dispatch(removeItemFromCart(item.product))}
            >
                <Trash2 />
            </button>
        </div>
    )
}

export default CartItem