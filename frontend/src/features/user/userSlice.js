import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const register = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const { data } = await axios.post("/api/v1/register", userData, config);
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Registeration failed. Please try again later")
    }
})

export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/profile");
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to load User profile")
    }
});

export const login = createAsyncThunk("user/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post("/api/v1/login", { email, password }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Login failed. please try again later");
    }
});

export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/logout");
        return data;
    } catch (error) {
        return rejectWithValue(error?.response.data || "Logout failed")
    }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const { data } = await axios.put("/api/v1/profile/update", userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Profile update failed")
    }
});

export const updatePassword = createAsyncThunk("user/updatePassword", async (passwords, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.put("/api/v1/password/update", passwords, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Password update failed")
    }
});

export const forgetPassword = createAsyncThunk("user/forgetPassword", async ({ email }, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post("/api/v1/password/forget", { email }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Forget password failed")
    }
});

export const resetPassword = createAsyncThunk("user/resetPassword", async ({ token, userData }, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.post(`/api/v1/reset/${token}`, userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Reset Password failed")
    }
});

//Admin: fetch all users
export const getAdminUsers = createAsyncThunk("user/getAdminUsers", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/v1/admin/users");
        return data.users;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Could not fetch users");
    }
});

//Admin: change a user's role
export const updateUserRoleAdmin = createAsyncThunk("user/updateUserRoleAdmin", async ({ id, role }, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.put(`/api/v1/admin/user/${id}`, { role }, config);
        return data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Could not update user role");
    }
});

//Admin: delete a user
export const deleteUserAdmin = createAsyncThunk("user/deleteUserAdmin", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/v1/admin/user/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Could not delete user");
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
        adminUsers: [],
        adminUsersLoading: false,
        roleUpdateSuccess: false,
        userDeleteSuccess: false,
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = null; },
        resetAdminUserState: (state) => {
            state.roleUpdateSuccess = false;
            state.userDeleteSuccess = false;
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Registration failed. Please try again later";
                state.user = null;
                state.isAuthenticated = false;
            })

        builder
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed. Please try again later";
                state.user = null;
                state.isAuthenticated = false;
            })

        builder
            .addCase(loadUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to load user profile";
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            })

        builder
            .addCase(logout.pending, (state) => { state.loading = true; state.error = null; })
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

        builder
            .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
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

        builder
            .addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Password update failed"
            });

        builder
            .addCase(forgetPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(forgetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(forgetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Forget Password Failed";
            });

        builder
            .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;
                state.message = action.payload.message;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Reset password failed";
            });

        builder
            .addCase(getAdminUsers.pending, (state) => {
                state.adminUsersLoading = true;
                state.error = null;
            })
            .addCase(getAdminUsers.fulfilled, (state, action) => {
                state.adminUsersLoading = false;
                state.adminUsers = action.payload;
            })
            .addCase(getAdminUsers.rejected, (state, action) => {
                state.adminUsersLoading = false;
                state.adminUsers = [];
                state.error = action.payload?.message || "Could not fetch users";
            });

        builder
            .addCase(updateUserRoleAdmin.pending, (state) => {
                state.adminUsersLoading = true;
                state.error = null;
            })
            .addCase(updateUserRoleAdmin.fulfilled, (state, action) => {
                state.adminUsersLoading = false;
                state.roleUpdateSuccess = true;
                state.adminUsers = state.adminUsers.map((u) =>
                    u._id === action.payload._id ? action.payload : u
                );
            })
            .addCase(updateUserRoleAdmin.rejected, (state, action) => {
                state.adminUsersLoading = false;
                state.error = action.payload?.message || "Could not update user role";
            });

        builder
            .addCase(deleteUserAdmin.pending, (state) => {
                state.adminUsersLoading = true;
                state.error = null;
            })
            .addCase(deleteUserAdmin.fulfilled, (state, action) => {
                state.adminUsersLoading = false;
                state.userDeleteSuccess = true;
                state.adminUsers = state.adminUsers.filter((u) => u._id !== action.payload);
            })
            .addCase(deleteUserAdmin.rejected, (state, action) => {
                state.adminUsersLoading = false;
                state.error = action.payload?.message || "Could not delete user";
            });
    },
});

export const { removeErrors, removeSuccess, resetAdminUserState } = userSlice.actions;
export default userSlice.reducer;