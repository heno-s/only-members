const express = require("express");
const router = express.Router();

const boardController = require("../controllers/boardsController");

router.get("/", boardController.boards_get);
router.get("/club-members", boardController.clubMembers_get);
router.get("/admins", boardController.admins_get);

module.exports = router;