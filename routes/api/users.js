var express = require('express');
var router = express.Router();
var db = require('../../queries/user');

router.get('/:id', db.getUser);
router.get('/:id/comments', db.getUserComments);

module.exports = router;
