import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import "dotenv/config"
import mongoose from "mongoose";
import authRouter from "./routes/authRoute.js";
import productRouter from "./routes/productsRoute.js";
import wishlistRouter from "./routes/wishListRoute.js";
import cartRouter from "./routes/cartRoute.js";
const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth/", authRouter)
app.use("/product/",productRouter)
app.use("/wishlist/",wishlistRouter)
app.use("/cart", cartRouter)

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


