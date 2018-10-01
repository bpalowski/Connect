//this will hold users info password
//to use the router you need express
const express = require("express");
const router = express.Router();

// Image
const gravatar = require("gravatar");

//To encrypt the password
const bcrypt = require("bcryptjs");

//To create jason web token
const jwt = require("jsonwebtoken");

//To add key to JWT form keys
const keys = require("../../config/keys");

//To create a secure users route
const passport = require("passport");

//Load User Model
const User = require("../../models/User");

//@route Get api/users/test
//@Description test users route
//@access Public Route
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//@route Get api/users/test
//@Description Register create a user
//@access Public

router.post("/register", (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    //If Email is taken
    if (user) {
      return res.status(400).json({ email: "Email not available" });
    } else {
      // this will check the email you want to use already has a picture and if it does it will use that image or just use a defualt.
      const picture = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // default
      });
      // creating the new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        picture
      });

      // Changing plain text passwor to Setting up password encryption 10 characters
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route Get api/users/login
//@Description Login user / Return Token 'JWT' jason web token
//@access Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find user by email matching email: with email email: email
  User.findOne({
    email: email
  }).then(user => {
    // Check for no user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    // If user is found
    // Check Password plain text password and compares it with bcrypt to see hash password an matches with the hashed password in the database
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        //Pyload for what you want in the JWT
        const payload = { id: user.id, name: user.name, picture: user.picture };

        // Creating the token with adding payload and key to expire in 1hr
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });

    //Test pass wor with just Json for postman
    // bcrypt.compare(password, user.password).then(isMatch => {
    //   if (isMatch) {
    //     res.json({ msg: "Success" });
    //   } else {
    //     return res.status(400).json({ password: "Password incorrect" });
    //   }
    // });
  });
});

//@route Get api/users/current
//@Description Return current user
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
    // res.json({ msg: "Success" });
  }
);

module.exports = router;
