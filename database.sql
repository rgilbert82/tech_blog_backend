-- DROP DATABASE IF EXISTS techblog;
-- CREATE DATABASE techblog;
--
-- \c techblog;

CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  image_url VARCHAR(255),
  admin BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  image VARCHAR(255),
  slug VARCHAR(100) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE posts ADD CONSTRAINT posts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE;

CREATE TABLE comments (
  ID SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  post_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE comments ADD CONSTRAINT comments_post_id_fkey
  FOREIGN KEY (post_id) REFERENCES posts (id)
  ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE;
