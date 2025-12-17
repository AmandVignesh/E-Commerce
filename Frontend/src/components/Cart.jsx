import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const DISCOUNT_PERCENTAGE = 25;

export default function CartDrawer({ open, onClose }) {
  const [cart, setCart] = useState({ items: [] });
  const token = Cookies.get("Jwt_token");
  const navigate = useNavigate();

  /* ---------------- FETCH CART ---------------- */
  const fetchCart = async () => {
     if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/cart/getCart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch cart");
      }

      setCart(data.cartProducts || data.cart || { items: [] });
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  /* ---------------- FETCH ONLY WHEN DRAWER OPENS ---------------- */
  useEffect(() => {
    if (open && token) {
      fetchCart();
    }
  },[open, token]);

  /* ---------------- ADD ITEM ---------------- */
  const addItem = async (id) => {
    try {
      await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id })
      });

      fetchCart();
    } catch (error) {
      console.error("Add item error:", error);
    }
  };

  /* ---------------- DECREASE ITEM ---------------- */
  const decreaseItem = async (id) => {
    try {
      await fetch("http://localhost:5000/cart/decrease", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id })
      });

      fetchCart();
    } catch (error) {
      console.error("Decrease item error:", error);
    }
  };

  /* ---------------- REMOVE ITEM COMPLETELY ---------------- */
  const removeItemCompletely = async (id, quantity) => {
    try {
      for (let i = 0; i < quantity; i++) {
        await fetch("http://localhost:5000/cart/decrease", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: id })
        });
      }

      fetchCart();
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  /* ---------------- CLEAR CART ---------------- */
  const clearCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to clear cart");
      }

      setCart({ items: [] });
    } catch (error) {
      console.error("Clear cart error:", error);
      alert(error.message);
    }
  };

  /* ---------------- PRICE CALCULATIONS ---------------- */
  const calculateDiscountedPrice = (price) =>
    price - (price * DISCOUNT_PERCENTAGE) / 100;

  const subtotal = cart.items.reduce((total, item) => {
    const discountedPrice = calculateDiscountedPrice(item.product.price);
    return total + discountedPrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-[420px] bg-white h-full p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        {/* Items */}
        {cart.items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          cart.items.map((item) => {
            const discountedPrice = calculateDiscountedPrice(
              item.product.price
            );

            return (
              <div
                key={item.product._id}
                className="flex gap-4 border-b pb-4 mb-4"
              >
                <img
                  src={item.product.image}
                  className="w-20 h-24 object-cover rounded"
                  alt={item.product.title}
                />

                <div className="flex-1">
                  <h4 className="font-semibold">{item.product.title}</h4>
                  <p className="text-blue-600 font-bold">
                    ${discountedPrice.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseItem(item.product._id)}
                      className="border px-2 rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addItem(item.product._id)}
                      className="border px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeItemCompletely(
                      item.product._id,
                      item.quantity
                    )
                  }
                  className="text-gray-400"
                >
                  <Trash2 />
                </button>
              </div>
            );
          })
        )}

        {/* Summary */}
        <div className="border-t pt-4 mt-6 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <button className="w-full mt-4 bg-[#000000] text-white py-3 rounded">
          Proceed to Checkout
        </button>

        <div className="flex gap-4 mt-3">
          <button onClick={()=>{
            onClose()
            navigate("/shop")
          }} className="flex-1 border text-center py-2 rounded">
            Continue Shopping
          </button>
          <button
            onClick={clearCart}
            className="flex-1 border py-2 rounded"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
