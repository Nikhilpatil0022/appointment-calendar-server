const Mongoose = require("mongoose");
const localDB =
  "mongodb+srv://nikhilpatil2705:Sangita27@cluster0.6aood1d.mongodb.net/";

const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Connected");
};
module.exports = connectDB;
