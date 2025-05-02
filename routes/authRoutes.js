const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post("/logout", auth, authController.logout);
router.post('/users', auth, authController.getUsers);
router.post('/users/users-to-create-group', auth, authController.getUsersToCreateGroup);

module.exports = router;

