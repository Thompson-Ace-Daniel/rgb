import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enums: ["red", "green", "blue"],
      trim: true,
      required: true,
    },
    tune: { type: String, trim: true, required: true },
    optionalReq: { type: String, trim: true },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      reqired: true,
    },
  },
  { timestamps: true },
);

const Draft = mongoose.model("Draft", DraftSchema);

export default Draft;
