import React, { useEffect, useState } from 'react'
import { PageTitle } from "../Components/PageTitle"
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';
import toast from 'react-hot-toast';
import Loader from '../Components/Loader';
import Product from "../Components/Product"
import Pagination from '../Components/Pagination';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

export const Products = () => {

    const navigate = useNavigate();
    const { products, productCount, loading, error, resultPerPage } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const category = searchParams.get("category") || "";
    const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromURL);
    const totalPages = Math.ceil(productCount / (resultPerPage || 6));

    //Handling pages
    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            const newSearchParams = new URLSearchParams(location.search);
            if (pageNumber === 1) {
                newSearchParams.delete("page");
            }
            else {
                newSearchParams.set("page", pageNumber);
            }
            navigate(`?${newSearchParams.toString()}`);
        }
    }

    //Handling category
    const handleCategory = (cat) => {
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.delete('page');
        if (cat == "All") {
            newSearchParams.delete('category');
        }
        else {
            newSearchParams.set("category", cat);
        }
        navigate(`?${newSearchParams.toString()}`);
    };

    //Calling get Product function
    useEffect(() => {
        dispatch(getProduct({ keyword, page: currentPage, category }));
    }, [dispatch, keyword, currentPage, category]);


    useEffect(() => {
        if (error) {
            toast.error(error.message);
            dispatch(removeErrors());
        }
    })

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className='flex flex-col min-h-screen bg-gray-50'>
                <PageTitle title={"Quantum Play | Products"} />
                <Navbar />

                <main className='grow container mx-auto px-4 py-8'>
                    <div className='flex flex-col md:flex-row gap-8'>

                        {/*Category Section */}
                        <aside className='w-full md:w-1/4'>
                            <div className='bg-white p-6 rounded-lg shadow-sm sticky top-24'>
                                <h3 className='text-xl font-semibold mb-4 text-gray-800 border-b border-slate-200 pb-2'>Categories</h3>
                                <ul className='space-y-2'>
                                    {["All", "PS4 Games", "PS5 Games", "Consoles", "Controllers", "Gaming Chairs", "Gaming Headsets", "Gaming Monitors"].map((cat) => (
                                        <li key={cat}>
                                            <button
                                                className='text-gray-600 hover:text-black transition-colors'
                                                onClick={() => handleCategory(cat)}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/*All products section */}
                        <section className='w-full md:w-3/4 bg-white shadow-sm p-6 rounded-lg'>
                            <div className='flex justify-between items-center mb-6'>
                                <h3 className='text-xl font-semibold mb-4 text-gray-800'>Our Products</h3>
                                <span className='text-gray-500 text-sm'>{products.length || 0} Items Found</span>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {products && products.map((product) => <Product key={product._id} product={product} />)}
                            </div>

                            {/*No products display section */}
                            {products?.length === 0 && (
                                <div className='text-center py-20'>
                                    <p>{`No Product found`}</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/*Pagination section */}
                    <div className='mt-12 flex justify-center'>
                        <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
                    </div>

                </main>

                <Footer />
            </div>
        </>
    )
}
