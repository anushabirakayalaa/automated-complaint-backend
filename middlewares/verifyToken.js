import jwt from "jsonwebtoken";
// Checks if token is valid

const verifyToken = (req, res, next) => {

  const authHeader  = req.headers.authorization;

  if (!authHeader ) {
    return res.status(401).json({ message: "Access denied! No token" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Attach user info to request
  req.user = decoded; 

  
  next();
};

export default verifyToken;
