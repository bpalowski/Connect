//this will hol users bio
const express = require("express");
const router = express.Router();

//@route Get api/profile/test
//@Description test profile route
//@access Public Route
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

module.exports = router;
