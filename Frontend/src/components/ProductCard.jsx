import React from 'react'
import { useState } from 'react'
import { ShoppingCart } from "lucide-react"
import { Link } from 'react-router-dom'


function ProductCard({product}) {
    
    const [isAdded, setIsAdded] = useState(false)
    const handleAddToCart = () => {
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

  return (
    <Link to={`/product/${product._id}`} className='w-[20%] h-[20%] rounded-lg z-10 shadow-2xl'>
      <div className="">
        <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-md">

            {/* Image Container */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden group cursor-pointer">
            <img
                src={product?.image || "/placeholder.svg"}
                alt={product?.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {isAdded && (
                <div className="absolute inset-0 bg-[#0EA5E9]/90 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-sm font-semibold">Added to Cart!</div>
                </div>
                </div>
            )}
            </div>

            {/* Content */}
            <div className="p-4">
            {/* Name */}
            <h3 className="font-semibold text-[#1E293B] mb-2 line-clamp-2 text-sm">
                {product?.title}
            </h3>

            <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                {product?.description}
            </p>

            <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-bold text-[#000000]">${product?.price}</span>

                {/* Replaced Button Component with HTML Button */}
                <button
                onClick={handleAddToCart}
                className="flex items-center gap-1 bg-[#000000] cursor-pointer hover:bg-gray-900 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md transition-colors"
                >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Add</span>
                </button>
            </div>
            </div>

        </div>
        </div>

    </Link>
  )
}

export default ProductCard
