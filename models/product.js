import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    stock: { type: Number, required: true },
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
