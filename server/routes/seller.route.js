import { Router, json } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../models/seller.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { authenticatedSeller } from "../middlewares/seller.middleware.js";

const sellerRouter = Router();

sellerRouter.use(json());

sellerRouter.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res
        .status(400)
        .json({ message: "Seller already exists! Try logging in." });
    }

    const newSeller = await Seller.create({ fullName, email, password });
    return res.status(201).json({ message: "Seller created successfully" });
  } catch (error) {
    console.error("Error registering new seller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sellerRouter.post("/login", async (req, res) => {
  const { mobile, email, password } = req.body;
  if ((!email && !mobile) || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  try {
    const existingSeller = await Seller.findOne({ email });

    if (!existingSeller) {
      return res
        .status(400)
        .json({ message: "Seller does not exist! Try registering." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingSeller.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }

    const token = jwt.sign(
      { _id: existingSeller._id },
      process.env.JWT_SELLER_SECRET
    );
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sellerRouter.get("/profile", authenticatedSeller, async (req, res) => {
  try {
    const sellerDetails = await Seller.findOne({ _id: req.seller._id }).select(
      "-_id fullName email address mobile"
    );
    return res.status(200).json(sellerDetails);
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sellerRouter.patch("/editProfile", authenticatedSeller, async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email) {
    return res.status(400).json({ message: "Name and Email cannot be empty" });
  }
  try {
    const existingSeller = await Seller.findOne({ _id: req.seller._id });
    if (!existingSeller) {
      return res.status(400).json({ message: "Seller does not exist" });
    }

    existingSeller.fullName = fullName;
    existingSeller.email = email;
    existingSeller.password = password;
    await existingSeller.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sellerRouter.post("/delete", authenticatedSeller, async (req, res) => {
  try {
    const existingSeller = await Seller.findOne({ _id: req.seller._id });
    if (!existingSeller) {
      return res.status(400).json({ message: "Seller does not exist" });
    }
    existingSeller.is_deleted = true;
    await existingSeller.save();
    return res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sellerRouter.post("/addCategory", authenticatedSeller, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: "Category name cannot be empty!",
    });
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists!" });
  }
  try {
    const newCategory = await Category.create({ name });
    return res.status(200).json({ message: "Category created successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sellerRouter.post("/addProduct", authenticatedSeller, async (req, res) => {
  const { name, price, image, description, category, stock } = req.body;
  if (!name || !price || !description || !category) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }
  try {
    const newProduct = await new Product({
      name,
      price,
      description,
      image,
      category,
      stock,
      ListedBy: req.seller._id,
    }).save();

    const seller = await Seller.findOne({ _id: req.seller._id });

    seller.listedProducts.push(newProduct._id);
    await seller.save();

    return res.status(200).json({
      message: "Product inserted successfuly",
    });
  } catch (error) {
    console.error("Error adding product", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export { sellerRouter };
