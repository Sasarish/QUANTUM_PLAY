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

const App = () => {

  //Getting user details after login
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    };
  }, [dispatch]);

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
        <Route path="/profile" element={<ProtectedRoute element={<Profile />}/>} />
        <Route path="/profile/update" element={<ProtectedRoute element={ <UpdateProfile />} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
