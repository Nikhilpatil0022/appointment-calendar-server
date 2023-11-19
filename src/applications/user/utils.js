const { default: mongoose } = require("mongoose");
const User = require("./Model");
const select_queries = require("../../constants/ModelSelectQueries.constants");

exports.getUserById = async (id) => {
  // id should be always valid (function must be called)
  let objectId = id;
  const user = await User.findOne({ _id: objectId }).select(
    select_queries.user
  );

  return user;
};
