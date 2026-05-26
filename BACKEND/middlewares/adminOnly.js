// allows only admin related operations

const adminOnly = (req, res, next) => {

  if (!["ADMIN", "SUPPORT_AGENT"].includes(req.user.role)) {
    return res.status(403).json({ message: "Admin or support agent only! Access denied" });
  }next();
};

export default adminOnly;
