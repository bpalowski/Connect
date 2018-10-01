//Server Local// and launching to Database/Mongoose
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//When sending a POST from the routes Body parser middleware to check if email is available goes through the request/post in routes/api/users if it is not available it will come back false for a post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//4 DB Config Set Up DataBase
const db = require("./config/keys").mongoURI;

//3 Connect Mongoose to MongoDB make a promise
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// //2 test
// app.get("/", (req, res) => res.send("Hello there"));

// Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

// 5 Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//Port 1 and eventually deploy to heroku
const port = process.env.Port || 5000;

app.listen(port, () => console.log(`Server runing on port ${port}`));
