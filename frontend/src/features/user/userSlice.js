import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

//Register API
export const register = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const { data } = await axios.post("/api/v1/register", userData, config);
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || "Registeration failed. Please try again later")
    }
})

//Get Profile
export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/profile");
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to load User profile")
    }
});

//Login API
export const login = createAsyncThunk("user/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };
        const { data } = await axios.post("/api/v1/login", { email, password }, config);
        console.log("Login Data", data);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Login failed. please try again later");
    }
});

//Logout API
export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/logout");
        return data;
    } catch (error) {
        return rejectWithValue(error?.response.data || "Logout failed")
    }
});

//Update Profile
export const updateProfile = createAsyncThunk("user/updateProfile", async (userData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const { data } = await axios.put("/api/v1/profile/update", userData, config);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || "Profile update failed")
    }
});

//Update Password
export const updatePassword = createAsyncThunk("user/updatePassword", async (passwords, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.put("/api/v1/password/update", passwords, config);
        return data;

    } catch (error) {
        return rejectWithValue(error.response?.data || "Password update failed")
    }
});


const userSlice = createSlice({
    name: "user",
    initialState: {
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
        message: null,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = null;
        }
    },
    extraReducers: (builder) => {

        //Builder for register function
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);

                //Store in local storage
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Registration failed. Please try again later";
                state.user = null;
                state.isAuthenticated = false;
            })

        //builder for login function
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);

                //Store in local storage
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed. Please try again later";
                state.user = null;
                state.isAuthenticated = false;
            })

        //builder for LoadUser function
        builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);

                //Store in local storage
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to load user profile";
                state.user = null;
                state.isAuthenticated = false;
                if (action.payload?.statusCode === 401) {
                    state.user = null;
                    state.isAuthenticated = false;
                    localStorage.removeItem("user");
                    localStorage.removeItem("isAuthenticated");
                }
            })

        //builder for logout function
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to logout user profile";
            })

        //builder for updateProfile function
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
                state.user = action.payload?.user || state.user;
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Profile upload failed";
            });

        //builder for updatePassword function
        builder
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Password update failed"
            });

    },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;