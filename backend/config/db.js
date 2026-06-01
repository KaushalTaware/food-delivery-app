import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/food-del");
    console.log("DB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error.message);

  }
};