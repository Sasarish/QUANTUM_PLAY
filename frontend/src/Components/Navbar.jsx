import { Link, useNavigate } from "react-router-dom";
import { Cpu, Gamepad, Gamepad2, Hexagon, Joystick, Menu, Orbit, Search, ShoppingBag, ShoppingCart, User, X, Zap } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileDropDownOpen, setProfileDropDownOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
    else {
      navigate("/products")
    }
    setSearchQuery("");
  };

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/*Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-grey-600"
        >
          <Orbit />
          <span>QUANTUM PLAY</span>
        </Link>

        {/*Pages */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-black transition font-semibold">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-black transition font-semibold">Products</Link>
          <Link to="/about-us" className="text-gray-700 hover:text-black transition font-semibold">About Us</Link>
          <Link to="/contact-us" className="text-gray-700 hover:text-black transition font-semibold">Contact Us</Link>
        </div>

        {/*Right section */}
        <div className="flex items-center gap-4">

          {/*Search section */}
          <form
            className="hidden sm:flex items-center border border-slate-300 rounded overflow-hidden"
            onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search Product"
              className="px-3 py-2 text-sm w-40 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="px-3 text-gray-500 hover:text-black transition" type="submit">
              <Search size={18} />
            </button>
          </form>

          {/*Cart button */}
          <Link to="/cart" className="relative text-gray-700 hover:text-black transition">
            <ShoppingCart />
            {cartItems.length > 0 &&
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-semibold min-w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            }
          </Link>

          {/*Login and Registeration */}
          {!isAuthenticated ?
            (
              <div className="hidden sm:flex items-center gap-4">
                <Link to="/login" className="text-gray-700 hover:text-black transition font-semibold">Login</Link>
                <Link to="/register" className="hidden sm:flex gap-2 items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition">
                  <User size={18} />
                  Register
                </Link>
              </div>
            ) :
            (
              <div className="relative hidden sm:block">
                <button className="flex items-center" onClick={() => setProfileDropDownOpen(!profileDropDownOpen)}>
                  <img src={user?.avatar?.url} alt={user?.name} title={user?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-600" />
                </button>

                {/*User setting and options */}
                {profileDropDownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropDownOpen(false)}>My Profile</Link>

                      {/*Checking whether admin or User */}
                      {user?.role === "admin" ? (
                        <>
                          <Link to='/admin/orders' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropDownOpen(false)}>Orders</Link>
                          <Link to='/admin/products' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropDownOpen(false)}>Products</Link>
                          <Link to='/admin/users' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropDownOpen(false)}>Users</Link>
                        </>
                      ) : (
                        <Link to='/orders' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropDownOpen(false)}>My Orders</Link>
                      )}
                      <Link to='/settings' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropDownOpen(false)}>Settings</Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => { handleLogout(); setProfileDropDownOpen(false); }}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}


          {/*Small devices */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-112.5 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}>
        <div className="flex flex-col p-4 gap-4">
          
          {/*Search section */}
          <form
            className="flex items-center border border-slate-300 rounded overflow-hidden"
            onSubmit={(e) => { handleSearch(e); setOpen(false); }}>
            <input
              type="text"
              placeholder="Search Product"
              className="px-3 py-2 text-sm w-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="px-3 text-gray-500 hover:text-black transition" type="submit">
              <Search size={18} />
            </button>
          </form>

          {/*User setting and options */}
          <Link to="/" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">Home</Link>
          <Link to="/products" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">Products</Link>
          <Link to="/about-us" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">About Us</Link>
          <Link to="/contact-us" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">Contact Us</Link>

          {/*Login and register */}
          {!isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-semibold" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 transition font-semibold" onClick={() => setOpen(false)}>Register</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 mt-2">
              <div className="flex items-center gap-3">
                <img src={user?.avatar?.url} alt={user?.name} title={user?.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xm  text-gray-500">{user?.email}</p>
                </div>
              </div>

              <Link to="/profile" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">My Profile</Link>
             
              {/*Checking user role */}
              {user?.role === "admin" ? (
                <>
                  <Link to="/admin/orders" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">Orders</Link>
                  <Link to="/admin/products" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">Products</Link>
                  <Link to="/admin/users" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">Users</Link>
                </>
              ) : (
                <Link to="/orders" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">My Orders</Link>
              )}
              <Link to="/settings" onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition font-semibold">Settings</Link>

              <button onClick={() => { handleLogout(); setOpen(false); }} className="text-left text-red-500 hover:text-red-600 transition font-semibold">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav >
  )
};

export default Navbar;