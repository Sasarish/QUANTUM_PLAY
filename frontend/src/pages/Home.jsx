import { useEffect } from "react";
import Footer from "../Components/Footer";
import ImageSlider from "../Components/ImageSlider";
import Navbar from "../Components/Navbar";
import { PageTitle } from "../Components/PageTitle";
import Product from "../Components/Product";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice"
import Loader from "../Components/Loader";
import toast from "react-hot-toast";

const Home = () => {

  const { products, productCount, loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  //Calling getProduct from productSlice
  useEffect(() => {
    dispatch(getProduct({ keyword: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <PageTitle title={"Quantum Play | Home"} />
      <Navbar />
      <ImageSlider />

      <div className="mt-12 p-8 flex flex-col items-center justify-around text-gray-900">
        <h1 className="text-4xl font-semibold mb-8 text-black text-center drop-shadow-sm">Latest Collections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;