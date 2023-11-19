const JsonWebToken = require("jsonwebtoken");
const JWT_SECRET_KEY = require("../../config");
const MESSAGE_CODES = require("../constants/MessageCodes.constants");

exports.checkForRequiredFields = (reqBody = {}, requiredFields = []) => {
  const errorsObj = {};
  let hasError = false;

  requiredFields.forEach((field) => {
    const fieldValue = reqBody[field];

    if (Array.isArray(fieldValue) && fieldValue.length === 0) {
      errorsObj[field] = MESSAGE_CODES.required;
      hasError = true;
    } else if (!fieldValue) {
      errorsObj[field] = MESSAGE_CODES.required;
      hasError = true;
    }
  });

  return [hasError, errorsObj];
};

exports.getJwt = (userId, userEmail) => {
  return JsonWebToken.sign({ id: userId, email: userEmail }, JWT_SECRET_KEY);
};

exports.getFullNameOfUser = (user) => {
  const { first_name, last_name, middle_name } = user;
  if (!user) {
    return "";
  }
  if (!(first_name || last_name)) {
    return email;
  }
  let fullName = "";
  if (first_name) {
    fullName += first_name[0].toUpperCase() + first_name.slice(1);
  }
  if (middle_name) {
    fullName += ` ${middle_name[0].toUpperCase() + middle_name.slice(1)}`;
  }
  if (last_name) {
    fullName += ` ${last_name[0].toUpperCase() + last_name.slice(1)}`;
  }
  return fullName;
};
