import React from 'react'
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux"
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import { PageTitle } from "../Components/PageTitle";


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { error, loading, success } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Login successfully", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/")
    }
  }, [dispatch, success, navigate])

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <PageTitle title={"Quantum Play | Login"} />
        <form
          onSubmit={loginSubmit}
          className="space-y-6"
        >

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">Please enter your details to Sign in</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1 block">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="hello@example.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1 block">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:black focus:border-transparent outline-none transition-all"
              placeholder="*********"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>


          <button className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
            {loading ? "Please wait" : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 ">
            Don't have an account?
            <Link
              className="text-black font-semibold hover:underline ms-1"
              to="/register"  >
              Sign up here
            </Link>
          </p>

          <p className="text-center text-sm text-gray-600 ">
            Forgot Password?
            <Link
              className="text-black font-semibold hover:underline ms-1"
              to="/password/forget"
            >
              Reset Password
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login