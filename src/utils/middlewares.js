const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = require("../../config");
const { getUserById } = require("../applications/user/utils");

const authenticateJWT = async (req, res, next) => {
  const authorizationToken = req.header("Authorization");
  if (!authorizationToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const [_, token] = authorizationToken.split(" ");
  jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const { id } = decoded;
    const loggedInUser = await getUserById(id);
    req.user = loggedInUser;
    next();
  });
};

module.exports = authenticateJWT;
