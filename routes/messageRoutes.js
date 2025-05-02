const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/:conversationId', auth, messageController.getMessages);
router.put('/seen', auth, messageController.markMessagesAsSeen);

module.exports = router;
