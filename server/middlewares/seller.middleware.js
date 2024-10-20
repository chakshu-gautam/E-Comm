import jwt from "jsonwebtoken";
const authenticatedSeller = async (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SELLER_SECRET);
  if (!decoded) {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
  req.seller = decoded;
  next();
};
export { authenticatedSeller };
