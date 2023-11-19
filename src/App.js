const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;

const router = require("./AppRoutes");

const http = require("http").Server(app);
const cors = require("cors");
const connectDB = require("./connections/DbConnection");

app.use(cors());
app.use(
  cors({
    origin: "https://zendenta-appointment.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable cookies and credentials for cross-origin requests
  })
);
app.use(bodyParser.json());
app.use("/", router);

const server = http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

connectDB();

// Handling Error
process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
