const express = require('express');
const { addBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/controller');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post("/addBlog", authMiddleware, addBlog);
router.get("/getBlogs", getBlogs);
router.get("/getBlogById/:id", getBlogById);
router.put("/updateBlog/:id", authMiddleware, updateBlog);
router.delete("/deleteBlog/:id", authMiddleware, deleteBlog);

module.exports = router;