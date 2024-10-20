import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
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
  cart: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
