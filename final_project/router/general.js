const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Enregistrer un utilisateur
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe obligatoire." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Ce nom d'utilisateur est déjà pris." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
});

// Get the book list. with Promise
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve) => resolve(books));

  getBooks.then((data) => res.json(data));
});

// Get book details based on ISBN, avec async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const book = await new Promise((resolve, reject) => {
    books[isbn] ? resolve(books[isbn]) : reject("Livre non trouvé.");
  });

  try {
    return res.json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur." });
  }

  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const booksByTitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title
  );

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "Aucun livre trouvé pour ce titre." });
  }

  return res.json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Livre non trouvé." });
  }

  if (Object.keys(book.reviews).length === 0) {
    return res.status(404).json({ message: "Aucun commentaire pour ce livre." });
  }

  return res.json(book.reviews);
});

module.exports.general = public_users;
