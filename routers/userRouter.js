const express = require('express');
const { register, login, getUsers, getUserById, updateUser, deleteUser, verifyToken } = require('../controllers/userController');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/userByid/:id", getUserById);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.post("/verifyToken", verifyToken);

module.exports = router;