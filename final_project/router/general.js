const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Enregistrer un utilisateur
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: "Nom d'utilisateur et mot de passe obligatoires.",
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      status: 409,
      error: "Conflict",
      message: "Ce nom d'utilisateur est déjà pris.",
    });
  }

  users.push({ username, password });
  return res.status(201).json({
    status: 201,
    message: "Utilisateur enregistré avec succès !",
  });
});

// Get the book list — axios
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    return res.status(200).json({
      status: 200,
      message: "OK",
      data: response.data,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "Impossible de récupérer les livres.",
    });
  }
});

// Endpoint interne utilisé par axios pour récupérer les livres
public_users.get("/books-data", (req, res) => {
  return res.json(books);
});

// Get book details based on ISBN — axios
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    const book = response.data[isbn];

    if (!book) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: `Aucun livre trouvé pour l'ISBN "${isbn}".`,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "OK",
      data: book,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "Erreur lors de la récupération du livre.",
    });
  }
});

// Get book details based on author — axios
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    const result = Object.values(response.data).filter(
      (book) => book.author.toLowerCase() === author
    );

    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: `Aucun livre trouvé pour l'auteur "${req.params.author}".`,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "OK",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "Erreur lors de la récupération des livres.",
    });
  }
});

// Get all books based on title — axios
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    const result = Object.values(response.data).filter(
      (book) => book.title.toLowerCase() === title
    );

    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: `Aucun livre trouvé pour le titre "${req.params.title}".`,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "OK",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "Erreur lors de la récupération des livres.",
    });
  }
});

// Get book review — axios
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/books-data`);
    const book = response.data[isbn];

    if (!book) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: `Aucun livre trouvé pour l'ISBN "${isbn}".`,
      });
    }

    if (Object.keys(book.reviews).length === 0) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Aucun commentaire pour ce livre.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "OK",
      data: book.reviews,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "Erreur lors de la récupération des avis.",
    });
  }
});

module.exports.general = public_users;