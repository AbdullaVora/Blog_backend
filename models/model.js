// const mongoose = require('mongoose');

// const blogSchema = mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     author: {
//         type: String,
//         required: true,
//     },
//     media: {
//         type: String,
//         required: true,
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     tags: {
//         type: [String],
//         required: true,
//     },
//     likes: {

//     },
//     comments: [{
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true
//         },
//         comment: {
//             type: String,
//             required: true
//         },
//         createdAt: {
//             type: Date,
//             default: Date.now
//         }
//     }],
// },
//     { timestamps: true }  // Automatically adds createdAt and updatedAt fields
// )

// const Blog = mongoose.model('Blog', blogSchema);
// module.exports = Blog;

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    media: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []  // Initialize as empty array
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;