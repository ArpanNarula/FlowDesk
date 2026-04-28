const express = require("express");
const { updateProfile, changePassword } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(protect);

router.put("/profile", updateProfile);
router.put("/password", changePassword);

module.exports = router;
