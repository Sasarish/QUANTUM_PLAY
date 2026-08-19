import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import Navbar from '../Components/Navbar'
import Loader from '../Components/Loader'
import { PageTitle } from '../Components/PageTitle'
import {
    getAdminProducts,
    createProduct,
    updateAdminProduct,
    deleteAdminProduct,
    removeErrors,
    resetAdminProductState,
} from '../features/products/productSlice'

const emptyForm = {
    name: "",
    description: "",
    category: "",
    price: "",
    mrp: "",
    stock: "",
};

//Product  form
const ProductFormModal = ({ product, onClose }) => {
    const dispatch = useDispatch();
    const { adminLoading } = useSelector((state) => state.product);
    const isEdit = Boolean(product);

    const [form, setForm] = useState(
        product
            ? {
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                mrp: product.mrp,
                stock: product.stock,
            }
            : emptyForm
    );
    const [images, setImages] = useState([]); 
    const [previews, setPreviews] = useState(product?.image?.map((img) => img.url) || []);

    //Handling input field states
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //handling image upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setPreviews([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages((prev) => [...prev, reader.result]);
                    setPreviews((prev) => [...prev, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    //Handling product add and update
    const submitHandler = (e) => {
        e.preventDefault();
        if (!form.name || !form.description || !form.category || !form.price || !form.mrp || form.stock === "") {
            toast.error("Please fill out all fields", { position: "top-center", autoClose: 3000 });
            return;
        }
        if (!isEdit && images.length === 0) {
            toast.error("Please upload at least one product image", { position: "top-center", autoClose: 3000 });
            return;
        }

        const payload = { ...form };
        if (images.length > 0) {
            payload.image = images;
        }

        // calling updateAdminProduct from productslice
        if (isEdit) {
            dispatch(updateAdminProduct({ id: product._id, productData: payload }));
        } 
        
        // calling createProduct from productslice
        else {
            dispatch(createProduct(payload));
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6'>
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-xl font-bold text-gray-900'>{isEdit ? "Edit Product" : "Add New Product"}</h3>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-700'>
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={submitHandler} className='space-y-4'>
                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Name</label>
                        <input name='name' value={form.name} onChange={handleChange}
                            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Description</label>
                        <textarea name='description' value={form.description} onChange={handleChange} rows={3}
                            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Category</label>
                        <input name='category' value={form.category} onChange={handleChange}
                            placeholder='e.g. PS5 Games'
                            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Price (LKR)</label>
                            <input type='number' name='price' value={form.price} onChange={handleChange} min="0"
                                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                        </div>
                        <div>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>MRP (LKR)</label>
                            <input type='number' name='mrp' value={form.mrp} onChange={handleChange} min="0"
                                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                        </div>
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Stock</label>
                        <input type='number' name='stock' value={form.stock} onChange={handleChange} min="0"
                            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none' />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>
                            Product Images {isEdit && <span className='text-xs text-gray-400 font-normal'>(leave empty to keep current images)</span>}
                        </label>
                        <input type='file' accept='image/*' multiple onChange={handleImageChange}
                            className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200' />
                        {previews.length > 0 && (
                            <div className='flex gap-2 mt-3 flex-wrap'>
                                {previews.map((src, i) => (
                                    <img key={i} src={src} alt="preview" className='w-16 h-16 rounded-lg object-cover border border-gray-200' />
                                ))}
                            </div>
                        )}
                    </div>

                    <button type='submit' disabled={adminLoading}
                        className='w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50'>
                        {adminLoading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    )
}


const AdminProductDashboard = () => {
    const dispatch = useDispatch();
    const { adminProducts, adminLoading, error, adminSuccess, adminDeleted } = useSelector((state) => state.product);

    const [searchTerm, setSearchTerm] = useState("");
    const [modalProduct, setModalProduct] = useState(null); 
    const [stockEdits, setStockEdits] = useState({}); 

    //calling getAdminProducts from productSlice
    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (adminSuccess) {
            toast.success(modalProduct?._id ? "Product updated" : "Product added", { position: "top-center", autoClose: 2000 });
            dispatch(resetAdminProductState());
            setModalProduct(null);
        }
        if (adminDeleted) {
            toast.success("Product deleted", { position: "top-center", autoClose: 2000 });
            dispatch(resetAdminProductState());
        }
    }, [error, adminSuccess, adminDeleted, dispatch]);

    //Getting all product using search
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAdminProducts(searchTerm.trim()));
    };

    //calling deleteAdminProduct from productSlice
    const deleteHandler = (id) => {
        if (window.confirm("Delete this product? This cannot be undone.")) {
            dispatch(deleteAdminProduct(id));
        }
    };

    const stockChangeHandler = (id, value) => {
        setStockEdits({ ...stockEdits, [id]: value });
    };

    //Handling product stock update
    const stockSaveHandler = (id) => {
        const newStock = stockEdits[id];
        if (newStock === undefined || newStock === "") return;
        dispatch(updateAdminProduct({ id, productData: { stock: Number(newStock) } }));
        const updated = { ...stockEdits };
        delete updated[id];
        setStockEdits(updated);
    };

    return (
        <>
            <PageTitle title="Quantum Play | Admin - Products" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-6xl mx-auto'>
                    <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
                        <h2 className='text-2xl font-extrabold text-black'>All Products</h2>
                        <button
                            onClick={() => setModalProduct({})}
                            className='flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold px-4 py-2.5 rounded-xl transition-all'
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>

                    <form onSubmit={searchSubmitHandler} className='flex items-center gap-2 mb-6 max-w-md'>
                        <input
                            type='text'
                            placeholder='Search products by name...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white'
                        />
                        <button type='submit' className='bg-gray-900 hover:bg-black text-white p-2.5 rounded-xl transition-all'>
                            <Search size={18} />
                        </button>
                    </form>

                    {adminLoading ? (
                        <Loader />
                    ) : (
                        <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead className='bg-gray-100 text-gray-600 uppercase text-xs'>
                                    <tr>
                                        <th className='p-3 text-left'>Image</th>
                                        <th className='p-3 text-left'>Name</th>
                                        <th className='p-3 text-left'>Category</th>
                                        <th className='p-3 text-left'>Price</th>
                                        <th className='p-3 text-left'>Stock</th>
                                        <th className='p-3 text-left'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminProducts.map((product) => (
                                        <tr key={product._id} className='border-t border-gray-100'>
                                            <td className='p-3'>
                                                <img src={product.image?.[0]?.url || "/placeholder.png"} alt={product.name}
                                                    className='w-12 h-12 rounded-lg object-cover' />
                                            </td>
                                            <td className='p-3 font-semibold text-gray-800 max-w-52 truncate'>{product.name}</td>
                                            <td className='p-3 text-gray-600'>{product.category}</td>
                                            <td className='p-3 font-semibold'>LKR {product.price}</td>
                                            <td className='p-3'>
                                                <div className='flex items-center gap-2'>
                                                    <input
                                                        type='number'
                                                        min="0"
                                                        value={stockEdits[product._id] ?? product.stock}
                                                        onChange={(e) => stockChangeHandler(product._id, e.target.value)}
                                                        className='w-20 px-2 py-1 border border-gray-200 rounded-lg text-xs'
                                                    />
                                                    {stockEdits[product._id] !== undefined && stockEdits[product._id] != product.stock && (
                                                        <button
                                                            onClick={() => stockSaveHandler(product._id)}
                                                            className='text-xs font-semibold text-white bg-gray-900 hover:bg-black px-2 py-1 rounded-lg'
                                                        >
                                                            Save
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='p-3'>
                                                <div className='flex items-center gap-3'>
                                                    <button onClick={() => setModalProduct(product)} className='text-gray-500 hover:text-black'>
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => deleteHandler(product._id)} className='text-red-500 hover:text-red-700'>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {adminProducts.length === 0 && (
                                <div className='text-center py-16 text-gray-500'>No products found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {modalProduct !== null && (
                <ProductFormModal
                    product={modalProduct._id ? modalProduct : null}
                    onClose={() => setModalProduct(null)}
                />
            )}
        </>
    )
}

export default AdminProductDashboard