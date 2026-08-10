import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../Components/Navbar'
import { PageTitle } from '../Components/PageTitle'
import { createNewOrder, createPaymentIntent, removeErrors } from '../features/order/orderSlice'
import { clearCartItems } from '../features/cart/cartSlice'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#1e293b',
            '::placeholder': { color: '#94a3b8' },
        },
        invalid: { color: '#dc2626' },
    },
};

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);

    const { shippingInfo, clientSecret, error, paymentLoading } = useSelector((state) => state.order);
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 5000 || itemsPrice === 0 ? 0 : 350;
    const taxPrice = Number((itemsPrice * 0.02).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    useEffect(() => {
        if (!shippingInfo?.address || cartItems.length === 0) {
            navigate("/shipping");
            return;
        }
        dispatch(createPaymentIntent(totalPrice));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [error, dispatch]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setProcessing(true);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user?.name,
                    email: user?.email,
                    phone: shippingInfo?.phoneNo,
                },
            },
        });

        if (result.error) {
            setProcessing(false);
            navigate("/order/fail", { state: { message: result.error.message } });
            return;
        }

        if (result.paymentIntent.status === "succeeded") {
            const orderResult = await dispatch(createNewOrder({
                shippingAddress: shippingInfo,
                orderItems: cartItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    product: item.product,
                })),
                paymentInfo: { id: result.paymentIntent.id, status: result.paymentIntent.status },
                itemPrice: itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            }));

            setProcessing(false);

            if (createNewOrder.fulfilled.match(orderResult)) {
                dispatch(clearCartItems());
                navigate("/order/success");
            } else {
                //Payment succeeded but saving the order failed — this needs manual follow-up, not a silent retry
                navigate("/order/fail", { state: { message: "Payment succeeded, but we couldn't save your order. Please contact support with your payment reference: " + result.paymentIntent.id } });
            }
        } else {
            setProcessing(false);
            navigate("/order/fail", { state: { message: "Payment was not completed." } });
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 pt-24'>
            <div className='w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl'>
                <h2 className='text-2xl font-extrabold text-slate-800 mb-2 text-center'>Payment Details</h2>
                <p className='text-sm text-gray-500 text-center mb-6'>Total to pay: <span className='font-bold text-gray-900'>LKR {totalPrice.toLocaleString()}</span></p>

                <form onSubmit={submitHandler} className='space-y-6'>
                    <div className='p-4 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-black'>
                        <CardElement options={cardElementOptions} />
                    </div>

                    <button
                        type='submit'
                        disabled={!stripe || processing || paymentLoading || !clientSecret}
                        className='w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Lock size={16} />
                        {processing ? "Processing..." : `Pay LKR ${totalPrice.toLocaleString()}`}
                    </button>
                </form>

                <p className='text-xs text-gray-400 text-center mt-4'>Payments are securely processed by Stripe. Your card details never touch our servers.</p>
            </div>
        </div>
    )
}

const Payment = () => {
    const options = useMemo(() => ({}), []);

    return (
        <>
            <PageTitle title="Quantum Play | Payment" />
            <Navbar />
            <Elements stripe={stripePromise} options={options}>
                <PaymentForm />
            </Elements>
        </>
    )
}

export default Payment