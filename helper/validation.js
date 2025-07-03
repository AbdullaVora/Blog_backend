const Joi = require('joi');

const validateBlog = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(10).max(500).required(),
        author: Joi.string().min(3).max(50).required(),
        category: Joi.string().min(3).max(50).required(),
        tags: Joi.array().items(Joi.string().min(1).max(30)).required(),
        media: Joi.string().uri().optional(),
        likes: Joi.number().integer().min(0).default(0),
        comments: Joi.array().items(Joi.object({
            user: Joi.string().required(),
            comment: Joi.string().min(1).max(500).required(),
            createdAt: Joi.date().default(() => new Date(), 'time of creation')
        })).default([])
    });

    return schema.validate(data, { abortEarly: false });
};

// const validateBlog = (data) => {
//     const schema = Joi.object({
//         title: Joi.string().min(3).max(100).required(),
//         description: Joi.string().min(10).max(500).required(),
//         author: Joi.string().min(3).max(50).required(),
//         category: Joi.string().min(3).max(50).required(),
//         tags: Joi.array().items(Joi.string().min(1).max(30)).required(),
//         media: Joi.string().uri().optional(),
//         likes: Joi.number().integer().min(0).default(0),
//         comments: Joi.array().items(Joi.object({
//             user: Joi.string().required(),
//             comment: Joi.string().min(1).max(500).required(),
//             createdAt: Joi.date().default(() => new Date(), 'time of creation')
//         })).default([])
//     });

//     return schema.validate(data, { abortEarly: false });  // moved inside the function
// };

const validateUpdateBlog = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100),
        description: Joi.string().min(10).max(500),
        author: Joi.string().min(3).max(50),
        category: Joi.string().min(3).max(50),
        tags: Joi.array().items(Joi.string().min(1).max(30)),
        media: Joi.string().uri().optional(),
        likes: Joi.number().integer().min(0).default(0),
        comments: Joi.array().items(Joi.object({
            user: Joi.string(),
            comment: Joi.string().min(1).max(500),
            createdAt: Joi.date().default(() => new Date(), 'time of creation')
        })).default([])
    });

    return schema.validate(data, { abortEarly: false });  // moved inside the function
};

const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            "string.empty": "Name is required.",
            "any.required": "Name is required."
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email address.",
            "any.required": "Email is required."
        }),
        media: Joi.string().optional().messages({
            "string.base": "Media must be a string URL."
        }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required."
        }),
        role: Joi.string().valid("admin", "user").default("user").messages({
            "any.only": "Role must be either 'admin' or 'user'."
        })
    }).options({ stripUnknown: true });

    return schema.validate(data, { abortEarly: false }); // returns all errors
};



const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email address.",
            "any.required": "Email is required."
        }),
        password: Joi.string().min(6).max(100).required().messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 6 characters long.",
            "string.max": "Password cannot exceed 100 characters.",
            "any.required": "Password is required."
        })
    });

    return schema.validate(data, { abortEarly: false });
};


module.exports = { validateBlog, validateUser, validateLogin, validateUpdateBlog };
