const express = require('express');
const { addBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/controller');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post("/addBlog", addBlog);
router.get("/getBlogs", getBlogs);
router.get("/getBlogById/:id", getBlogById);
router.put("/updateBlog/:id", updateBlog);
router.delete("/deleteBlog/:id", deleteBlog);

module.exports = router;