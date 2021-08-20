const express = require("express");

const postController = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// localhost:3000
router
.route("/")
.get(protect, postController.getAllPosts)
.post(protect, postController.createPost);

// route to update and delete post
router
.route("/:id")
.get(protect, postController.getOnePost)
.patch(protect, postController.updatePost)
.delete(protect, postController.deletePost);


module.exports = router;