import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("Jwt_token");

  /* ---------------- CHECK IF PRODUCT EXISTS IN CART ---------------- */
  const checkProductInCart = async () => {
    if (!token || !product?._id) return;

    try {
      const res = await fetch("http://localhost:5000/cart/getCart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        const items = data.cart?.items || data.cartProducts?.items || [];
        const exists = items.some(
          (item) => item.product._id === product._id
        );
        setIsAdded(exists);
      }
    } catch (error) {
      console.error("Check cart error:", error);
    }
  };

  /* ---------------- RUN ON LOAD ---------------- */
  useEffect(() => {
    checkProductInCart();
  }, [product?._id]);

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      // ✅ re-check cart after add
      toast.success("Product Added To Cart")
      setIsAdded(true);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="w-[20%] h-[20%] rounded-lg z-10 shadow-2xl"
    >
      <div>
        <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-md">

          {/* Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden group cursor-pointer">
            <img
              src={product?.image || "/placeholder.svg"}
              alt={product?.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-[#1E293B] mb-2 line-clamp-2 text-sm">
              {product?.title}
            </h3>

            <p className="text-xs text-gray-600 mb-4 line-clamp-2">
              {product?.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-bold text-[#000000]">
                ${product?.price}
              </span>

              <button
                onClick={handleAddToCart}
                disabled={loading || isAdded}
                className="flex items-center gap-1 bg-[#000000] cursor-pointer hover:bg-gray-900 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md transition-colors disabled:opacity-60"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">
                  {isAdded ? "Added" : loading ? "Adding..." : "Add To Cart"}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
