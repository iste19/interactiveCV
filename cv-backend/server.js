const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require("cors");

connectDb();
const app = express();

const corsOptions = {
  origin: "https://interactivecv.istefatsawda.com",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.static("../public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
