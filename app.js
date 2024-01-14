const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/blogwebsite', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home route to display all posts
app.get('/', async (req, res) => {
  const posts = await Post.find();
  res.render('index', { posts });
});

// New post form route
app.get('/new', (req, res) => {
  res.render('new');
});

// Create new post route
app.post('/new', async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });
  await post.save();
  res.redirect('/');
});

// View individual post route
app.get('/post/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  res.render('post', { post });
});


// ... (existing code) ...

// Edit post form route
app.get('/edit/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  res.render('edit', { post });
});

// Update post route
app.post('/edit/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  await Post.findByIdAndUpdate(postId, { title, content });
  res.redirect(`/post/${postId}`);
});

// ... (existing code) ...

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
