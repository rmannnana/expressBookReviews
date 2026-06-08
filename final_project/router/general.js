const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books));
  return res.status(300).json({ message: "Books sent." });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const booksByAuthor = Object.entries(books).filter(
    ([id, book]) => book.author === author
  );

  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
