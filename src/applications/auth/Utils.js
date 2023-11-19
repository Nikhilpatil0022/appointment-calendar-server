const jwt = require("jsonwebtoken");
const { getUserById } = require("../user/utils");

exports.fetchUserByToken = function (req) {
  return new Promise(async (resolve, reject) => {
    if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authorization;
      const [_, token] = authorization.split(" ");
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
      } catch (err) {
        reject("Forbidden: Invalid Token");
        return;
      }

      const { id } = decoded;
      const loggedInUser = await getUserById(id);
      if (loggedInUser) {
        resolve(loggedInUser);
        return;
      } else {
        reject("Forbidden: Invalid Token");
      }
    } else {
      reject("Unauthorized: Token not found");
    }
  });
};
