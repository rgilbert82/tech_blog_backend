var express = require('express');
var router = express.Router();
var db = require('../../queries/conversation');

router.post('/', db.createConversation);
router.delete('/:id', db.deleteConversation);
router.get('/:id/comments', db.getComments);

module.exports = router;
