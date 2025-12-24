import Razorpay from "razorpay";
import crypto from "crypto";
import { OrderModel } from "../models/orderModel.js";
import { UserModel } from "../models/userModel.js";
import { CartModel } from "../models/cartModel.js";
import "dotenv/config";

const razorpay = new Razorpay({
  key_id: process.env.Razor_Pay_Key_ID,
  key_secret: process.env.Razor_Pay_Key_Secret,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, shippingInfo, pricing, paymentMethod } = req.body;
    const userId = req.user?.userId;

    // ---------------------- FIX: Format Items ----------------------
    const formattedItems = items.map((item) => ({
      product: item.product || item._id || item.id,
      quantity: item.quantity,
    }));

    // If product ID is missing from any item, throw a clean error
    if (formattedItems.some(i => !i.product)) {
      return res.status(400).json({
        success: false,
        message: "Invalid items: Product field missing in one or more items."
      });
    }

    // ---------------------- COD ORDER FLOW ----------------------
    if (paymentMethod === "cod") {
      const order = await OrderModel.create({
        user: userId,
        items: formattedItems,
        shippingInfo,
        paymentInfo: {
          method: "cod",
          status: "completed",
        },
        pricing,
        status: "confirmed",
      });

      // Add order to user profile
      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { orders: order._id }, profile: shippingInfo },
        { new: true }
      );

      // Clear Cart
      await CartModel.findOneAndUpdate({ user: userId }, { items: [] });

      return res.json({
        success: true,
        message: "COD order placed successfully",
        orderId: order._id,
      });
    }

    // ---------------------- RAZORPAY ORDER FLOW ----------------------

    const options = {
      amount: Math.round(pricing.total * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create DB order with Razorpay ID
    const order = await OrderModel.create({
      user: userId,
      items: formattedItems,
      shippingInfo,
      paymentInfo: {
        method: paymentMethod,
        razorpayOrderId: razorpayOrder.id,
        status: "pending",
      },
      pricing,
      status: "pending",
    });

    // Send details to frontend
    return res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order._id,
      keyId: process.env.Razor_Pay_Key_ID,
    });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create order",
      details: error.message,
    });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      req.body;
    const userId = req.user.id;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.Razor_Pay_Key_Secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await OrderModel.findByIdAndUpdate(orderId, {
        "paymentInfo.status": "failed",
        status: "cancelled",
      });

      return res.status(400).json({
        success: false,
        error: "Payment verification failed",
      });
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        "paymentInfo.razorpayPaymentId": razorpayPaymentId,
        "paymentInfo.razorpaySignature": razorpaySignature,
        "paymentInfo.status": "completed",
        status: "confirmed",
      },
      { new: true }
    );

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { orders: order._id },
        profile: order.shippingInfo,
      },
      { new: true }
    );

    await CartModel.findOneAndUpdate({ user: userId }, { items: [] });

    res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await OrderModel.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
