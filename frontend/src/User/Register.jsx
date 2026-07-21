import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux"
import { register } from "../features/user/userSlice";
import { removeErrors, removeSuccess } from "../features/user/userSlice";
import { PageTitle } from "../Components/PageTitle";

const Register = () => {

  const [preview, setPreview] = useState("https://i.postimg.cc/zfPkg6Qq/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image-1978396.jpg");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("");

  const disPatch = useDispatch();
  const navigate = useNavigate();
  const { success, error, loading } = useSelector((state) => state.user);

  //Asigning form values to user
  const handleChange = (e) => {
    if (e.target.name == "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  }

  //Register user details to db
  const registerNow = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill out all the required fields", {
        position: "top-center", autoClose: 3000
      });
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    //Calling register funtion from userSlice
    disPatch(register(myForm));
  }

  //Throwing error message through toast
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      disPatch(removeErrors());
    }
  }, [disPatch, error]);

  //Throwing success message through toast
  useEffect(() => {
    if (success) {
      toast.success("Registration successful", { position: "top-center", autoClose: 3000 });
      disPatch(removeSuccess());
      navigate("/login")
    }
  }, [disPatch, success])

  return (

    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <PageTitle title={"Quantum Play | Register"} />
        <form
          encType="multipart/form-data"
          className="space-y-6"
          onSubmit={registerNow}
        >

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-sm text-gray-500 mt-2">Join us and start your journey</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1 block">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:black focus:border-transparent outline-none transition-all"
              placeholder="Logan"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1 block">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="hello@example.com"
              name="email"
              value={email}
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img src={preview} alt="" id="preview" className="h-12 w-12 object-cover rounded-sm bg-gray-100" />
            </div>
            <label className="block">
              <span className="sr-only">Choose your Profile picture</span>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-black hover:file:bg-gray-100"
              />
            </label>
          </div>

          <button className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
            {loading ? "Please wait" : "Signup"}
          </button>

          <p className="text-center text-sm text-gray-600">Already have an account?
            <Link className="text-black font-semibold hover:underline ms-1" to="/login">
              Sign in here
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Register