const express = require("express");
const app = express();
const PORT = 5000;
const { MONGOURI } = require("./key");
const mongoose = require("mongoose");
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("mongodb connection succesfuuly");
});
mongoose.connection.on("error", (err) => {
  console.log("mongodb connection failed", err);
});
require("./models/user");
require("./models/post")
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.listen(PORT, () => {
  console.log("server is runnin on ", PORT);
});
