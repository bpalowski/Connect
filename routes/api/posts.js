const express = require("express");
const router = express.Router();

//@route Get api/posts/test
//@Description test posts route
//@access Public Route
router.get("/test", (req, res) => res.json({ msg: "Post Works" }));

module.exports = router;
