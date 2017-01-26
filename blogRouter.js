'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create("Title 1","Content for title 1","John Doe","Jan 1 2020");
BlogPosts.create("Title 2","Content for title 2","Joe Smith","Jan 2 2020");
BlogPosts.create("Title 3","Content for title 3","Henry Doe","Jan 3 2020");

// Send JSON response of all blog posts on GET request to root
router.get('/', (req,res) =>{
  res.json(BlogPosts.get());
});

// Delete blog post by id
router.delete('/:id', (req,res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.id}\``);
  res.status(204).end();
});

// When a new blog is added, ensure it has the required fields.
// If not, log error and return 400 status code with a helpful message.
// If so, add the new item and return it with a status 201.

router.post('/', jsonParser, (req,res) =>{
  const requiredFields = ['title','content','author'];
  for (let i = 0; i <requiredFields.length; i += 1){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missng \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(post);
});

// When PUT request comes in with updated item, ensure it has the
// required fields. Also ensure that item id in url path, and
// item id in the updated item object match. If there are problems with any
// of that, log error and send back status code 400. Otherwise
// call `BlogPosts.update` with updated item.

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).json(updatedItem);
});

module.exports = router;
