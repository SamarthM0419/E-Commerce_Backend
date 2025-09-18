const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
 
  let token = req.headers["authorization"]?.split(" ")[1];
  if (!token && req.cookies) {
    token = req.cookies.token; 
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedObj);
    req.user = decodedObj; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
