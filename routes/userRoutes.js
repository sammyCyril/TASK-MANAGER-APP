const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");
const updateProfilePicture  = require('../controllers/userController');
const upload = multer({ dest: "uploads/" });

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Profile picture update
// router.post(
//   "/update-profile-picture",
//   upload.single("image"),
//   authController.updateProfilePicture
// );

module.exports = router;
