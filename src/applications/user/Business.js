const { default: mongoose } = require("mongoose");

const User = require("./Model");
const select_queries = require("../../constants/ModelSelectQueries.constants");

exports.getUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const users = await User.find({
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { full_name: { $regex: search, $options: "i" } },
      ],
    }).select(select_queries.user);

    res.json(users);
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = mongoose.Types.ObjectId(id);

    const user = await User.findOne({ _id: objectId }).select(
      select_queries.user
    );

    res.json(user);
  } catch (error) {
    console.error("User search error:", error);
    res.status(400).json({ message: "Id is not valid" });
  }
};
