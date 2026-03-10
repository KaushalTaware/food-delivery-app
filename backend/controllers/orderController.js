import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const placeOrder = async (req, res) => {

  try {

    const { userId, items, address, amount } = req.body;

    // Create Razorpay order first
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order in DB
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      razorpayOrderId: razorpayOrder.id
    });

    await newOrder.save();

    // Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
  success: true,
  order: razorpayOrder,
  orderId: newOrder._id,
  key: process.env.RAZORPAY_KEY_ID
});

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error creating order"
    });
  }
};
import crypto from "crypto";

const verifyOrder = async (req, res) => {

  const {
    orderId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  } = req.body;

  try {

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if(expectedSignature === razorpay_signature){

      await orderModel.findByIdAndUpdate(orderId, { payment: true });

      res.json({
        success: true,
        message: "Payment Verified"
      });

    }else{

      res.json({
        success:false,
        message:"Invalid Signature"
      });

    }

  } catch (error) {

    console.log(error);

    res.json({
      success:false
    });

  }

};

//user order for frontend
const userOrders = async (req,res) => {

  try {

    const userId = req.body.userId

    const orders = await orderModel.find({userId})

    res.json({
      success:true,
      data:orders
    })

  } catch (error) {
    console.log(error)
    res.json({success:false})
  }

}

//listing order for admin panel

const listOrders = async (req,res)=>{

  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error)
    res.json({success:false})
  }

}

//api for updating order status

const updateStatus = async (req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Order Status Updated"})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Failed to update order status"})
  }

}
export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };