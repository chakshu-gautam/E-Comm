import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
  },
  ListedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
