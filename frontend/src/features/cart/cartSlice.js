import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

//Adding products to cart
export const addToCartItem = createAsyncThunk("cart/addToCart", async ({ id, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`);
        return {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.image[0].url,
            stock: data.product.stock,
            quantity,
        }

    } catch (error) {
        return rejectWithValue(error.response?.data || "An error Occurred while add to cart");
    }
})

const initialState = {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    success: false,
    message: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },

        removeMessage: (state) => {
            state.message = null;
        },

        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },
        removeItemFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((i) => i.product !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        }
    },
    extraReducers: (builder) => {

        //Builder for addToCartItem function
        builder
            .addCase(addToCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartItem.fulfilled, (state, action) => {
                const item = action.payload;

                //Handling the same products cart addition
                const existingItem = state.cartItems.find((i) => i.product === item.product);

                if (existingItem) {
                    existingItem.quantity = item.quantity;
                    state.message = `Updated ${item.name} quantity in the cart`;
                }
                else {
                    state.cartItems.push(item);
                    state.message = `${action.payload.name} added to cart`;
                }

                state.loading = false;
                state.error = null;
                state.success = true;
                //Saving cart item details in local storage
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            })
            .addCase(addToCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            })
    },
});

export const { removeErrors, removeMessage, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;