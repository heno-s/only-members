const express = require('express');
const router = express.Router();

const usersController = require("../controllers/usersController");

router.get("/", usersController.users_get);
router.post("/create-post", usersController.createPost_post);
router.get("/:profileId", usersController.user_get);

router.post("/:profileId/admin-configuration", usersController.adminConfig_post);

router.get("/:profileId/posts/:postId/update", usersController.updatePost_get);
router.post("/:profileId/posts/:postId/update", usersController.updatePost_post);

router.post("/:profileId/posts/:postId/delete", usersController.deletePost_post);

module.exports = router;
