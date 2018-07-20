var db = require('../database.js');
var async = require('async');
var slugify = require('../helpers/slugify.js');

//=============================================================================
// QUERIES
//=============================================================================

function getPosts(req, res, next) {
  var sql = 'SELECT users.name AS user_name, users.image_url AS user_avatar, posts.* FROM posts ' +
            'INNER JOIN users ON users.id = posts.user_id ' +
            'ORDER BY posts.created_at DESC;';

  db.any(sql)
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function(err) {
      return next(err);
    });
}

//=============================================================================

function getPost(req, res, next) {
  var slug = req.params.slug
  var sql  = 'SELECT users.name AS user_name, users.author_description, users.image_url AS user_avatar, posts.* FROM posts ' +
             'INNER JOIN users ON users.id = posts.user_id ' +
             'WHERE posts.slug = $1 ' +
             'ORDER BY posts.created_at DESC;';

  db.one(sql, [slug])
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function(err) {
      return next(err);
    });
}

//=============================================================================

function createPost(req, res, next) {
  var body        = req.body.body;
  var title       = req.body.title;
  var image       = req.body.image;
  var description = req.body.description;
  var user_id     = req.body.user_id;
  var slug        = slugify(title);
  var sql = 'INSERT INTO posts (body, title, image, description, slug, user_id) ' +
            'VALUES ($1, $2, $3, $4, $5, $6) returning *;';

  db.one(sql, [body, title, image, description, slug, user_id])
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function(err) {
      return next(err);
    });
}

//=============================================================================

function getPostConversation(req, res, next) {
  var postSlug = req.params.slug;
  var convId   = req.params.id;

  async.waterfall([
    // Get Post
    function(callback) {
      var sql = 'SELECT posts.*, users.name AS username FROM posts ' +
                'INNER JOIN users ON users.id = posts.user_id ' +
                'WHERE slug = $1;';
      db.one(sql, [postSlug])
        .then(function(data) {
          callback(null, data);
        }).catch(function(err) {
          callback(err, null);
        });
    },
    // Then get conversation
    function(post, callback) {
      var sql = 'SELECT * FROM conversations WHERE id = $1 AND post_id = $2;';
      db.one(sql, [convId, post.id])
        .then(function(data) {
          callback(null, { post: post, conversation: data });
        }).catch(function(err) {
          callback(err, null);
        });
    },
    // Then get comments
    function(obj, callback) {
      var sql = 'SELECT comments.*, users.name AS username, users.image_url AS avatar FROM comments ' +
                'INNER JOIN users ON users.id = comments.user_id ' +
                'WHERE comments.conversation_id = $1 ' +
                'ORDER BY created_at ASC;';
      db.any(sql, [convId])
        .then(function(data) {
          callback(null, { post: obj.post, conversation: obj.conversation, comments: data });
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

function getPostConversations(req, res, next) {
  var postId = req.params.id;
  var sql = 'SELECT * FROM conversations WHERE post_id = $1 ORDER BY created_at DESC;';

  db.any(sql, [postId])
    .then(function(data) {
      res.status(200)
        .json(data);
    }).catch(function(err) {
      return next(err);
    });
}

//=============================================================================

function updatePost() {

}

//=============================================================================

function deletePost() {

}

//=============================================================================
// EXPORTS
//=============================================================================

module.exports = {
  getPosts: getPosts,
  createPost: createPost,
  getPost: getPost,
  updatePost: updatePost,
  getPostConversation: getPostConversation,
  getPostConversations: getPostConversations,
  deletePost: deletePost
}
