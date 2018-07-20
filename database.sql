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
  author_description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  body TEXT NOT NULL,
  image VARCHAR(255),
  slug VARCHAR(100) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE posts ADD CONSTRAINT posts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE;

CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE conversations ADD CONSTRAINT conversations_post_id_fkey
  FOREIGN KEY (post_id) REFERENCES posts (id)
  ON DELETE CASCADE;

CREATE TABLE comments (
  ID SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  conversation_id INTEGER NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE comments ADD CONSTRAINT comments_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES conversations (id)
  ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE;
