// allows only admin related operations

const adminOnly = (req, res, next) => {

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only! Access denied" });
  }next();
};

export default adminOnly;
