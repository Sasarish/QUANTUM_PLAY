import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About"
import Contact from "./pages/Contact"
import Register from "./User/Register"
import ProductDetails from "./pages/ProductDetails";
import { Products } from "./pages/Products";
import Login from "./User/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/user/userSlice";
import Profile from "./User/Profile";
import UpdateProfile from "./User/UpdateProfile"
import ProtectedRoute from "./Components/ProtectedRoute";
import UpdatePassword from "./User/UpdatePassword";
import ForgetPassword from "./User/ForgetPassword";
import ResetPassword from "./User/ResetPassword";
import Cart from "./cart/Cart";
import { getCart, resetCartState } from "./features/cart/cartSlice";
import Shipping from "./order/Shipping";
import ConfirmOrder from "./order/ConfirmOrder";
import Payment from "./order/Payment";
import OrderSuccess from "./order/OrderSuccess";
import OrderFail from "./order/OrderFail";
import MyOrders from "./order/MyOrders";
import OrderDetails from "./order/OrderDetails";
import AdminOrders from "./admin/AdminOrders";
import AdminProductDashboard from "./admin/AdminProductDashboard";
import AdminUserDashboard from "./admin/AdminUserDashboard";
import Settings from "./Components/Settings";
import AdminOrderDetails from "./admin/AdminOrderDetails";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    };
  }, [dispatch]);

  //keep cart in sync with login state
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    } else {
      dispatch(resetCartState());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
        <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />
        <Route path="/password/forget" element={<ForgetPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />

        {/* order flow */}
        <Route path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
        <Route path="/order/confirm" element={<ProtectedRoute element={<ConfirmOrder />} />} />
        <Route path="/order/payment" element={<ProtectedRoute element={<Payment />} />} />
        <Route path="/order/success" element={<ProtectedRoute element={<OrderSuccess />} />} />
        <Route path="/order/fail" element={<ProtectedRoute element={<OrderFail />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<MyOrders />} />} />
        <Route path="/order/:id" element={<ProtectedRoute element={<OrderDetails />} />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<AdminOrders />} adminOnly={true} />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<AdminProductDashboard />} adminOnly={true} />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<AdminUserDashboard />} adminOnly={true} />} />
        <Route path="/admin/order/:id" element={<ProtectedRoute element={<AdminOrderDetails />} adminOnly={true} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;