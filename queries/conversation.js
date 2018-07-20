var db = require('../database.js');
var async = require('async');

//=============================================================================
// QUERIES
//=============================================================================

function createConversation(req, res, next) {
  var body    = req.body.body;
  var post_id = req.body.post_id;
  var user_id = req.body.user_id;

  async.waterfall([
    // Verify User
    function(callback) {
      var sql = 'SELECT * FROM users WHERE id = $1;';
      db.one(sql, [user_id])
        .then(function(data) {
          callback(null, data);
        }).catch(function(err) {
          callback(err, null);
        });
    },
    // Then create the conversation
    function(user, callback) {
      var sql = 'INSERT INTO conversations (post_id) VALUES ($1) returning *;';
      db.one(sql, [post_id])
        .then(function(data) {
          callback(null, { user: user, conversation: data });
        }).catch(function(err) {
          callback(err, null);
        });
    },
    // Then create the comment
    function(obj, callback) {
      var sql = 'INSERT INTO comments (body, user_id, conversation_id) VALUES ($1, $2, $3) returning *;';
      db.one(sql, [body, user_id, obj.conversation.id])
        .then(function(data) {
          callback(null, obj.conversation);
        }).catch(function(err) {
          callback(err, null);
        });
    }
  ],
  function(err, results) {
    if (err) {
      return next(err);
    } else {
      res.status(200)
        .json(results);
    }
  });
}

//=============================================================================

function deleteConversation(req, res, next) {

}

//=============================================================================

function getComments(req, res, next) {
  var conversationId = req.params.id;
  var sql = 'SELECT comments.*, users.name AS username, users.image_url AS user_avatar FROM comments ' +
            'INNER JOIN users ON users.id = comments.user_id ' +
            'WHERE comments.conversation_id = $1 ' +
            'ORDER BY created_at ASC;';

  db.any(sql, [conversationId])
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function(err) {
      return next(err);
    });
}

//=============================================================================
// EXPORTS
//=============================================================================

module.exports = {
  createConversation: createConversation,
  deleteConversation: deleteConversation,
  getComments: getComments
}
