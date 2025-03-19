import express from "express";
import { PostController } from '../controllers/postControllers.js';
import { usersUpload } from '../multer/multer.js';

const router = express.Router();
const postController = new PostController();

router.get("/schedule/:userId", postController.getSchedule.bind(postController));
router.get("/schedule/:userId/posts/:postId", postController.getPost.bind(postController));
router.post("/schedule/:userId/posts", usersUpload.single("imagePath"), postController.createPost.bind(postController));
router.patch("/schedule/:userId/posts/:postId", usersUpload.single("imagePath"), postController.updatePost.bind(postController));
router.delete("/schedule/:userId/posts/:postId", postController.deletePost.bind(postController));

export default router;