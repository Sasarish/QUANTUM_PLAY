import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


//Get All Products
export const getProduct = createAsyncThunk("product/getProduct", async ({ keyword, page = 1, category }, { rejectWithValue }) => {
    try {
        let link = "/api/v1/products?page=" + page;
        if (category) {
            link += `&category=${category}`;
        }
        if (keyword) {
            link += `&keyword=${keyword}`;
        }


        const { data } = await axios.get(link);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong..!");
    }
});

//Get single Product details
export const getProductDetails = createAsyncThunk("product/getProductDetails", async (id, { rejectWithValue }) => {
    try {
        const link = `/api/v1/product/${id}`;
        const { data } = await axios.get(link);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong..!");
    }
});

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product: null,
        resultsPerPage: 12,
        totalPages: 0,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        //GetProduct funtion builder
        builder
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                console.log("Fulfilled action payload", action.payload);
                state.loading = false;
                state.error = null;
                state.products = action.payload.products;
                state.productCount = action.payload.productCount;
                state.resultPerPage = action.payload.resultPerPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.products = [];
                state.error = action.payload || "Something went wrong";
            });

        //GetProduct Details function builder
        builder
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.product = action.payload.product;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
})

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;