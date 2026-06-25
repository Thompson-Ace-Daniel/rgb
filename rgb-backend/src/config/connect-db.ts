import mongoose from "mongoose";

export const connectDB = async (DATABASE_URL: string) => {
  try {
    await mongoose.connect(DATABASE_URL);
  } catch (err: any) {
    console.error("Couldn't connect to database. Please try again!");
  }
};
