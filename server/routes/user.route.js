import { Router, json } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { authenticatedUser } from "../middlewares/user.middleware.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const userRouter = Router();

userRouter.use(json());

userRouter.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists! Try logging in." });
    }

    const newUser = await User.create({ fullName, email, password });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error registering new user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { mobile, email, password } = req.body;
  if ((!email && !mobile) || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User does not exist! Try registering." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }

    const token = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_USER_SECRET
    );
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/profile", authenticatedUser, async (req, res) => {
  try {
    const userDetails = await User.findOne({ _id: req.user._id }).select(
      "-_id fullName email mobile address"
    );
    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.patch("/editProfile", authenticatedUser, async (req, res) => {
  const { fullName, email, mobile, address } = req.body;
  if (!fullName || !email) {
    return res.status(400).json({ message: "Name and Email cannot be empty" });
  }
  try {
    const existingUser = await User.findOne({ _id: req.user._id });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    existingUser.fullName = fullName;
    existingUser.email = email;
    existingUser.mobile = mobile;
    existingUser.address = address;
    await existingUser.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/delete", authenticatedUser, async (req, res) => {
  try {
    const existingUser = await User.findOne({ _id: req.user._id });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    existingUser.is_deleted = true;
    await existingUser.save();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/addProductToCart", authenticatedUser, async (req, res) => {
  const { productId } = req.query;
  if (!productId) {
    return res.status(400).json({ message: "Product Id is missing" });
  }
  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: "Product does not exist" });
    }
    const user = await User.findById(req.user._id);
    user.cart.push(product._id);
    await user.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/cart", authenticatedUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart",
      select: "-_id name price description",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error getting user cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/buyOne", authenticatedUser, async (req, res) => {
  const { productId } = req.query;
  const { quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is missing" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product does not exist" });
    }
    const price = product.price;
    const totalPrice = price * quantity;

    const newOrder = await Order.create({
      products: [
        {
          product: productId,
          quantity: quantity,
          totalPrice: totalPrice,
        },
      ],
      user: req.user._id,
      orderDate: new Date(),
      status: "pending",
    });

    const user = await User.findById(req.user._id);
    user.orders.push(newOrder._id);
    await user.save();
    return res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error buying product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/preview", async (_, res) => {
  const products = await Product.find({}).select("name description price -_id");
  res.status(200).json(products);
});

export { userRouter };
