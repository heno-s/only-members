const express = require("express");
const router = express.Router();

const benefitsController = require("../controllers/benefitsController");

router.get("/", benefitsController.benefits_get);

router.get("/become-member", benefitsController.becomeMember_get);
router.post("/become-member", benefitsController.becomeMember_post);

router.get("/become-an-admin", benefitsController.becomeAnAdmin_get);
router.post("/become-an-admin", benefitsController.becomeAnAdmin_post);

module.exports = router;