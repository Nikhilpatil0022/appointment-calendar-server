const bcrypt = require("bcrypt");

const UserModel = require("../user/Model");
const MESSAGE_CODES = require("../../constants/MessageCodes.constants");
const {
  checkForRequiredFields,
  getJwt,
  getFullNameOfUser,
} = require("../../utils/Utils");
const { fetchUserByToken } = require("./Utils");

// register user
exports.register = async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;

  const [hasError, errorObject] = checkForRequiredFields(req.body, [
    "first_name",
    "last_name",
    "email",
    "password",
  ]);

  if (hasError) {
    return res.status(400).json({ errorObject, code: "invalid" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      errorObject: { password: MESSAGE_CODES.less_than_6_chars },
      code: "invalid",
    });
  }

  // check for unique email
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(400).json({
      code: "invalid",
      errorObject: { email: MESSAGE_CODES.user_already_exists },
    });
  }

  const full_name = getFullNameOfUser({ first_name, last_name });

  // hashing the password and setting it to database
  bcrypt.hash(password, 11).then(async (hash) => {
    await UserModel.create({
      first_name,
      last_name,
      email,
      full_name,
      password: hash,
    })
      .then((user) => {
        const token = getJwt(user._id, user.email);
        res.status(200).json({
          message: "Profile successfully created",
          token,
          user: { first_name, last_name, email, password },
        });
      })
      .catch((err) =>
        res.status(500).json({
          message: MESSAGE_CODES.invalid,
          error: err.mesage,
        })
      );
  });
};

// log in user

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password is provided
  const [hasError, errorObject] = checkForRequiredFields(req.body, [
    "email",
    "password",
  ]);
  if (hasError) {
    res.status(400).json({ errorObject, code: "invalid" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({
        code: "not_found",
        message: MESSAGE_CODES.user_not_found,
      });
    } else {
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          const token = getJwt(user._id, user.email);
          res.status(200).json({
            code: "successful",
            token,
            user: {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              password,
            },
          });
        } else {
          res.status(400).json({ message: MESSAGE_CODES.wrong_password });
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      message: MESSAGE_CODES.invalid,
      error: err.message,
    });
  }
};

exports.user = async (req, res) => {
  fetchUserByToken(req)
    .then((user) => {
      console.log("I AM USER", user);
      res.status(200).json({
        code: "successful",
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          id: user._id,
        },
      });
    })
    .catch((err) => res.status(400).json({ message: err }));
};
