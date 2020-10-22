const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/", authController.auth_get);

router.get("/register", authController.register_get);
router.post("/register", authController.register_post);

router.get("/log-in", authController.logIn_get);
router.post("/log-in", authController.logIn_post);

module.exports = router;