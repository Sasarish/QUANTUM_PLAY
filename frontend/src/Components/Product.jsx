import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'

const Product = ({ product }) => {

    const [rating, setRating] = useState(product.ratings || 0)
    const imageUrl = product.image?.[0]?.url || "/placeholder.png";

    return (
        <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-slate-100'>
            <Link to={`/product/${product._id}`} className='group block'>
                <div className='h-56 overflow-hidden'>
                    <img src={imageUrl} alt={product.name} className='h-full w-full object-cover group-hover:scale-105 transition' loading='lazy' />
                </div>
                <div className='p-4 space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-800 line-clamp-1'>{product.name}</h3>
                    <p className='text-sm text-gray-500 line-clamp-1'>{product.description}</p>
                </div>
            </Link>
            <div className='px-4 pb-4 space-y-2'>
                <div className='flex items-center gap-2'>
                    <Rating value={rating} onRatingChange={(e) => setRating(e)} />
                    <span className='text-xs text-gray-500 font-semibold'>({product.numOfReviews} Reviews)</span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='text-black font-semibold text-lg'>LKR {product.price}</span>
                    <button className='bg-gray-700 text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-900 transition'>Add to Cart </button>
                </div>
            </div>
        </div>
    )
}

export default Product