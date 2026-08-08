import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createNewOrder = createAsyncThunk("order/createNewOrder", async (order, { rejectWithValue }) => {
    try {
        const { data } = await axios.post("/api/v1/new/order", order);
        return data.order;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not place order");
    }
});

export const myOrders = createAsyncThunk("order/myOrders", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/orders/user");
        return data.orders;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not fetch orders");
    }
});

export const getOrderDetails = createAsyncThunk("order/getOrderDetails", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/order/${id}`);
        return data.order;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not fetch order details");
    }
});

export const getAllOrdersByAdmin = createAsyncThunk("order/getAllOrdersByAdmin", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/admin/orders");
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not fetch orders");
    }
});

export const updateOrder = createAsyncThunk("order/updateOrder", async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`/api/v1/admin/order/${id}`, { status });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not update order");
    }
});

export const deleteOrder = createAsyncThunk("order/deleteOrder", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Could not delete order");
    }
});

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        order: null,
        loading: false,
        error: null,
        success: false,
        totalAmount: 0,
        isDeleted: false,
        isUpdated: false,
        shippingInfo: JSON.parse(sessionStorage.getItem("shippingInfo")) || {},
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; },
        resetOrderState: (state) => {
            state.order = null;
            state.success = false;
            state.isDeleted = false;
            state.isUpdated = false;
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            sessionStorage.setItem("shippingInfo", JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createNewOrder.fulfilled, (state, action) => { state.loading = false; state.success = true; state.order = action.payload; })
            .addCase(createNewOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(myOrders.pending, (state) => { state.loading = true; })
            .addCase(myOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
            .addCase(myOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(getOrderDetails.pending, (state) => { state.loading = true; })
            .addCase(getOrderDetails.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
            .addCase(getOrderDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(getAllOrdersByAdmin.pending, (state) => { state.loading = true; })
            .addCase(getAllOrdersByAdmin.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload.orders; state.totalAmount = action.payload.totalAmount; })
            .addCase(getAllOrdersByAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateOrder.fulfilled, (state) => { state.isUpdated = true; })
            .addCase(updateOrder.rejected, (state, action) => { state.error = action.payload; })

            .addCase(deleteOrder.fulfilled, (state) => { state.isDeleted = true; })
            .addCase(deleteOrder.rejected, (state, action) => { state.error = action.payload; });
    },
});

export const { removeErrors, removeSuccess, resetOrderState, saveShippingInfo } = orderSlice.actions;
export default orderSlice.reducer;