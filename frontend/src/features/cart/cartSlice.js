import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch the logged-in user's cart from the backend
export const getCart = createAsyncThunk("cart/getCart", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/cart");
        return data.cartItems;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not load cart");
    }
});

// Add and update item quantity in cart
export const addToCartItem = createAsyncThunk("cart/addToCart", async ({ id, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post("/api/v1/cart", { id, quantity });
        return data.cartItems;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "An error occurred while adding to cart");
    }
});

// Remove one item
export const removeItemFromCart = createAsyncThunk("cart/removeItem", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/cart/${id}`);
        return data.cartItems;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not remove item");
    }
});

// Clear cart (used after placing an order)
export const clearCartItems = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete("/api/v1/cart");
        return data.cartItems;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not clear cart");
    }
});

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
    message: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeMessage: (state) => { state.message = null; },
        // called on logout — cart will remove from both local and db
        resetCartState: (state) => {
            state.cartItems = [];
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //Builder for getCart function
            .addCase(getCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //Builder for addToCart function
            .addCase(addToCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                state.message = "Cart updated";
            })
            .addCase(addToCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.cartItems = action.payload;
                state.message = "Item removed from cart";
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(clearCartItems.fulfilled, (state) => {
                state.cartItems = [];
            });
    },
});

export const { removeErrors, removeMessage, resetCartState } = cartSlice.actions;
export default cartSlice.reducer;