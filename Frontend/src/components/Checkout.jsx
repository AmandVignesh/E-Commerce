import { useState, useEffect } from "react";
import {ShoppingCart,CreditCard,Lock,Truck,RefreshCw,Shield,Plus,Minus,Check} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
export default function CheckoutPage() {
  /* ---------------- USER TOKEN ---------------- */
  const token = Cookies.get("Jwt_token");

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");

  /* ---------------- CART STATE ---------------- */
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setItems([]);
        setLoadingCart(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/cart/getCart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const cartItems = data.cart?.items || data.cartProducts?.items || [];

        setItems(
          cartItems.map((i) => ({
            _id: i.product._id,
            title: i.product.title,
            price: i.product.price,
            image: i.product.image,
            quantity: i.quantity,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [token]);

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading your cart...
      </div>
    );
  }

  /* ---------------- CALCULATIONS ---------------- */
  const shippingFee = 99;
  const taxRate = 0.18;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingFee;

  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to clear cart");
      }

      setItems({ items: [] });
    } catch (error) {
      console.error("Clear cart error:", error);
      alert(error.message);
    }
  };

  const validateForm = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "country",
    ];

    if (paymentMethod === "card") {
      required.push("cardNumber", "expiryDate", "cvv");
    }

    const newErrors = {};
    required.forEach((f) => {
      if (!formData[f]) newErrors[f] = true;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()){
        toast.error("Please Enter all details");
        return
    } 
    //clearCart()
    toast.success("Order placed successfully!");

  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b  top-0">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-8 h-8 text-black" />
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-gray-500">Complete your purchase securely</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 max-w-2xl">
            {["Cart", "Checkout", "Payment", "Done"].map((step, i) => (
              <div key={step} className="flex items-center flex-1 gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${i < 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {i === 0 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:inline text-sm">{step}</span>
                {i < 3 && <div className="flex-1 h-0.5 bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* SHIPPING */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["fullName", "Full Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["city", "City"],
                ["state", "State"],
                ["pincode", "Pincode"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className={`w-full mt-1 px-4 py-2 border rounded-lg ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                >
                  <option value="">Select</option>
                  <option>India</option>
                  <option>USA</option>
                </select>
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

            {["card", "upi", "cod"].map((m) => (
              <label
                key={m}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer mb-3
                ${paymentMethod === m ? "border-black bg-gray-100" : ""}`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === m}
                  onChange={() => setPaymentMethod(m)}
                />
                {m === "card" && <CreditCard />}
                {m === "upi" && <span>₹</span>}
                {m === "cod" && <Truck />}
                <span className="capitalize">{m}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:sticky lg:top-24 bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 mb-6 border-b pb-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">${item.price}</p>
              </div>
            </div>
          ))}

          {/* PRICE SUMMARY */}
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingFee}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-black text-white py-3 rounded-lg flex justify-center gap-2"
          >
            <Lock size={16} /> Place Order
          </button>

          <p className="text-xs text-center text-gray-500 mt-3 flex justify-center gap-1">
            <Shield size={12} /> Secure payment
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t bg-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <RefreshCw className="mx-auto mb-2" />
            Free Returns
          </div>
          <div>
            <Lock className="mx-auto mb-2" />
            Secure Checkout
          </div>
          <div>
            <Truck className="mx-auto mb-2" />
            Fast Delivery
          </div>
        </div>
      </footer>
    </div>
  );
}
