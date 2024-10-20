import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    unique: true,
    min: "1000000000",
    max: "9999999999",
  },
  address: {
    type: String,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  listedProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
});

sellerSchema.pre("save", async function (next) {
  const seller = this;
  if (!seller.isModified("password")) {
    return next();
  }
  seller.password = await bcrypt.hash(seller.password, 10);
  next();
});

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
