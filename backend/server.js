import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartroute.js";
import orderRouter from "./routes/orderRoute.js";


//app config

const app = express()
const port = 4000

//middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();
console.log(process.env.RAZORPAY_KEY_ID)
//api endpoints
app.use("/api/food",foodRouter)

app.use("/images",express.static('uploads'))

app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("api working")

})

app.listen(port,()=>{
    console.log(`server started on port http://localhost:${port}`)
})



