const express = require("express");
const router = express.Router();

const benefitsController = require("../controllers/benefitsController");

router.get("/", benefitsController.benefits_get);

router.get("/join-the-club", benefitsController.joinTheClub_get);
router.post("/join-the-club", benefitsController.joinTheClub_post);

router.get("/become-an-admin", benefitsController.becomeAnAdmin_get);
router.post("/become-an-admin", benefitsController.becomeAnAdmin_post);

module.exports = router;