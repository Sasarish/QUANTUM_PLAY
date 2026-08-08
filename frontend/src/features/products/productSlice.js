import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


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

export const getProductDetails = createAsyncThunk("product/getProductDetails", async (id, { rejectWithValue }) => {
    try {
        const link = `/api/v1/product/${id}`;
        const { data } = await axios.get(link);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong..!");
    }
});

export const newReview = createAsyncThunk("product/newReview", async (reviewData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.put("/api/v1/review", reviewData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Could not submit review");
    }
});

export const getCategories = createAsyncThunk("product/getCategories", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/categories");
        return data.categories;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Could not fetch categories");
    }
});

export const checkCanReview = createAsyncThunk("product/checkCanReview", async (productId, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/can-review/${productId}`);
        return data.canReview;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Could not check review eligibility");
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
        reviewLoading: false,
        reviewSuccess: false,
        categories: [],
        canReview: false,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeReviewSuccess: (state) => {
            state.reviewSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.products = action.payload.products;
                state.productCount = action.payload.productCount;
                state.resultsPerPage = action.payload.resultsPerPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.products = [];
                state.error = action.payload || "Something went wrong";
            });

        builder
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.canReview = false;
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

        builder
            .addCase(newReview.pending, (state) => {
                state.reviewLoading = true;
                state.error = null;
            })
            .addCase(newReview.fulfilled, (state, action) => {
                state.reviewLoading = false;
                state.reviewSuccess = action.payload.success;
                state.product = action.payload.product;
            })
            .addCase(newReview.rejected, (state, action) => {
                state.reviewLoading = false;
                state.error = action.payload || "Something went wrong";
            });

        builder
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.error = action.payload || "Something went wrong";
            });

        builder
            .addCase(checkCanReview.fulfilled, (state, action) => {
                state.canReview = action.payload;
            })
            .addCase(checkCanReview.rejected, (state) => {
                state.canReview = false;
            });
    },
})

export const { removeErrors, removeReviewSuccess } = productSlice.actions;
export default productSlice.reducer;