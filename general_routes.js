const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// --- ASYNC / PROMISE / AXIOS IMPLEMENTATIONS (Task 10 - Task 13 Requirement) ---

// Task 10: Get all books using Async/Await
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book details by ISBN using Async/Await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 12: Get book details by Author using Async/Await
public_users.get('/async/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by author", error: error.message });
  }
});

// Task 13: Get book details by Title using Async/Await
public_users.get('/async/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by title", error: error.message });
  }
});

module.exports.general = public_users;