import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import "dotenv/config"
import mongoose from "mongoose";
import authRouter from "./routes/authRoute.js";
import productRouter from "./routes/productsRoute.js";
import wishlistRouter from "./routes/wishListRoute.js";
import cartRouter from "./routes/cartRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import profileRouter from "./routes/profileRoute.js";
const app = express();

app.use(cors({
    origin: "*",
}));

app.use(express.json());

app.use("/auth/", authRouter)
app.use("/product/",productRouter)
app.use("/wishlist/",wishlistRouter)
app.use("/cart", cartRouter)
app.use("/payment/", paymentRouter)
app.use("/profile", profileRouter)

const PORT = process.env.port || 3000;
const url = process.env.mongo_url;

if(!url){
    console.log("Mongo url is not defined in .env file");
    process.exit(1);
}

const main = async ()=>{
    try {
        await connectDb(url)
        app.listen(PORT, ()=>{
            console.log(`Server is running on ${PORT}`)
        })
    } catch (error) {
        console.log("Error in connecting Database",error)
    }
    
}
main()


