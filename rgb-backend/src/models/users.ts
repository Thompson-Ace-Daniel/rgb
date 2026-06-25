import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "anonymous" },
    email: { type: String, trim: true, reqired: "true" },
    uid: { type: mongoose.Schema.Types.ObjectId, required: true },
    password: { type: String, required: true, minlength: 6, trim: true },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
