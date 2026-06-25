import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enums: ["red", "green", "blue"],
      trim: true,
      required: true,
    },
    tune: { type: String, trim: true, required: true, enum: ["pidgin", "dumb", "fluent", "default"] },
    optionalReq: { type: String, trim: true },
    recipient: {type: String, default: "You", trim: true},
    uid: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Draft = mongoose.model("Draft", DraftSchema);

export default Draft;
