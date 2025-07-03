const { uploadMedia } = require("../helper/uploadMedia");
const { validateBlog, validateUpdateBlog } = require("../helper/validation");
const Blog = require("../models/model");

const addBlog = async (req, res) => {
    try {
        // console.log("req.body", req.body);
        // const { error } = validateBlog(req.body);
        // if (error) {
        //     return res.status(400).json({ error: "Validation Error", message: error.details.map(detail => detail.message) });
        // }
        const { title, description, author, media, category, tags, likes, comments } = req.body;

        let mediaUrl = media;


        // const cloudMedia = await uploadMedia(media, "BlogsMedia");
        // console.log("cloudMedia", cloudMedia);
        // if (!cloudMedia) {
        //     return res.status(500).json({ error: "Media Upload Failed", message: "Failed to upload media. Please try again." });
        // }

        if (typeof media === "string" && media.startsWith("data:")) {
            const cloudMedia = await uploadMedia(media, "BlogsMedia");
            console.log("cloudMedia", cloudMedia);

            if (!cloudMedia) {
                return res.status(500).json({ error: "Media Upload Failed", message: "Failed to upload media. Please try again." });
            }

            mediaUrl = cloudMedia.url; // or whatever URL field your upload function returns
        }

        const blog = await Blog.create({
            title,
            description,
            author,
            media: mediaUrl,
            category,
            tags,
            likes: [],
            comments: []
        })
        res.status(201).json({ message: "Blog added successfully", blog });
    } catch (error) {
        console.error("Error in addBlog:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ error: "No blogs found", message: "No blogs available in the database." });
        }
        res.status(200).json({ message: "Blogs retrieved successfully", blogs });
    } catch (error) {
        console.error("Error in getBlogs:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}


const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const findBlog = await Blog.findById(blogId);

        if (!findBlog) {
            return res.status(404).json({ error: "Blog not found", message: "No blog found with this ID." });
        }

        const { title, description, author, media, category, tags, likes, comments } = req.body;

        let cloudMedia = null;
        if (media) {
            if (media.startsWith("data:")) {
                console.log("Media is a data URL, uploading to cloud");
                cloudMedia = await uploadMedia(media, "BlogsMedia");
                if (!cloudMedia) {
                    return res.status(500).json({ error: "Media Upload Failed", message: "Failed to upload media. Please try again." });
                }
            } else {
                cloudMedia = { url: media }; // If media is not a data URL, use it as is
            }
        }
        // Create update object with only the fields that are being updated
        const updateData = {
            title: title || findBlog.title,
            description: description || findBlog.description,
            author: author || findBlog.author,
            media: cloudMedia?.url || findBlog.media,
            category: category || findBlog.category,
            tags: tags || findBlog.tags,
        };

        // Only update likes if they are provided in the request
        if (likes) {
            updateData.likes = Array.isArray(likes) ? likes : findBlog.likes || [];
        }

        // Only update comments if new comment is provided
        if (comments) {
            const newComment = {
                user: comments.user,
                name: comments.name || "Anonymous", // Use provided name or fallback to "Anonymous"
                comment: comments.comment,
                createdAt: new Date()
            };
            updateData.$push = { comments: newComment };
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
            new: true,
            runValidators: true
        }).populate('author', 'name').populate('comments.user', 'name');

        res.status(200).json({
            message: "Blog updated successfully",
            blogs: updatedBlog
        });

    } catch (error) {
        console.error("Error in updateBlog:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}

const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found", message: "No blog found with this ID." });
        }
        res.status(200).json({ message: "Blog retrieved successfully", blog });
    } catch (error) {
        console.error("Error in getBlogById:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog not found", message: "No blog found with this ID." });
        }
        res.status(200).json({ message: "Blog deleted successfully", blog: deletedBlog });
    } catch (error) {
        console.error("Error in deleteBlog:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

module.exports = {
    addBlog,
    getBlogs,
    updateBlog,
    getBlogById,
    deleteBlog
};