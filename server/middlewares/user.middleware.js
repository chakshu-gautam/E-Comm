import jwt from "jsonwebtoken";
const authenticatedUser = (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }
  const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
  if (!decoded) {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }

  req.user = decoded;
  next();
};

export { authenticatedUser };
