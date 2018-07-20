var db = require('../database.js');
var async = require('async');

//=============================================================================
// QUERIES
//=============================================================================

function createComment(req, res, next) {
  var body            = req.body.body;
  var user_id         = req.body.user_id;
  var conversation_id = req.body.conversation_id;

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
    // Then create the comment
    function(user, callback) {
      var sql = 'INSERT INTO comments (body, user_id, conversation_id) VALUES ($1, $2, $3) returning *;';
      db.one(sql, [body, user_id, conversation_id])
        .then(function(data) {
          data.username = user.name;
          data.user_avatar = user.image_url;
          callback(null, data);
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

function deleteComment(req, res, next) {

}

//=============================================================================
// EXPORTS
//=============================================================================

module.exports = {
  createComment: createComment,
  deleteComment: deleteComment
}
