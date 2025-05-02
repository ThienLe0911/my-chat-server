const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const auth = require('../middlewares/auth');

router.post('/create', auth, conversationController.createConversation);
router.get('/', auth, conversationController.getUserConversations);
router.post('/findOrCreate', auth, conversationController.findOrCreateConversation);
router.get('/:conversationId', auth, conversationController.getUserConversation);

module.exports = router;
