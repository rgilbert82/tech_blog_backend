var express = require('express');
var router = express.Router();
var db = require('../../queries/post');

router.get('/', db.getPosts);
router.post('/', db.createPost);
router.get('/:slug', db.getPost);
router.put('/:id', db.updatePost);
router.delete('/:id', db.deletePost);
router.get('/:id/conversations', db.getPostConversations);
router.get('/:slug/conversations/:id', db.getPostConversation);

module.exports = router;
