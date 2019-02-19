const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ encoded: false }));
app.use(bodyParser.json());

// DB Config
const { mongoURI } = require("./config/keys");
mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

require("./models/User");

// Passport
app.use(passport.initialize());
require("./config/passport")(passport);

// Use Routes
const users = require("./routes/api/users");
app.use("/api/users", users);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  const root = require("path").join(__dirname, "client", "build");
  app.use(express.static(root));
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root });
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
