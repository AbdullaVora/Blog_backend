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
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        media: Joi.string().optional(), // or Joi.string().uri() if expecting URL
        password: Joi.string().required(),
        role: Joi.string().valid("admin", "user").default("user")
    }).options({ stripUnknown: true }); // this removes unknown fields instead of rejecting

    return schema.validate(data);
};


const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required()
    });

    return schema.validate(data, { abortEarly: false });  // moved inside the function
}


module.exports = { validateBlog, validateUser, validateLogin, validateUpdateBlog };
