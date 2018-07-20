var db = require('../database.js');
var async = require('async');

//=============================================================================
// QUERIES
//=============================================================================

function getUser(req, res, next) {
  var id  = req.params.id;
  var sql = 'SELECT * FROM users WHERE id = $1;';

  db.one(sql, [id])
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function(err) {
      return next(err);
    });
}

//=============================================================================

function createUser(req, res, next) {
  var user = req.body;
  var sqlFetch  = 'SELECT * FROM users WHERE id = $1;';
  var sqlCreate = 'INSERT INTO users (id, name, email, image_url) VALUES ($1, $2, $3, $4) returning *;';

  // Create a user record if none exists, else return the existing record.

  db.one(sqlFetch, [user.id])
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function() {
      db.one(sqlCreate, [user.id, user.name, user.email, user.imageUrl])
        .then(function(data) {
          res.status(200)
            .json(data);
        }).catch(function(err) {
          return next(err);
        });
    });
}

//=============================================================================

function getUserPosts(req, res, next) {
  var id  = req.params.id;
  var sql = 'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC;';

  db.any(sql, [id])
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function(err) {
      return next(err);
    });
}

//=============================================================================

function getUserComments(req, res, next) {
  var userId = req.params.id;
  var sql = 'SELECT comments.*, posts.slug AS post_slug, posts.description FROM comments ' +
            'INNER JOIN conversations ON conversations.id = comments.conversation_id ' +
            'INNER JOIN posts ON posts.id = conversations.post_id ' +
            'WHERE comments.user_id = $1 ' +
            'GROUP BY comments.id, posts.slug, posts.description ' +
            'ORDER BY comments.created_at DESC;';

  db.any(sql, [userId])
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
  getUser: getUser,
  createUser: createUser,
  getUserPosts: getUserPosts,
  getUserComments: getUserComments
}
