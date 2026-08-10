//Server-authoritative order amount calculation — mirrors the frontend's display formula,
//but computed here from the DB-stored cart, never trusting client-supplied numbers.
export const calculateOrderAmounts = (cartItems) => {
    const itemPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemPrice > 5000 || itemPrice === 0 ? 0 : 350;
    const taxPrice = Number((itemPrice * 0.02).toFixed(2));
    const totalPrice = itemPrice + shippingPrice + taxPrice;

    return { itemPrice, shippingPrice, taxPrice, totalPrice };
};