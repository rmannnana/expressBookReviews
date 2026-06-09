const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Uniquement pour les utilisateurs déjà inscrits
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: "Nom d'utilisateur et mot de passe requis.",
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      status: 401,
      error: "Unauthorized",
      message: "Identifiants incorrects.",
    });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  req.session.authorization = { accessToken: token, username };

  return res.status(200).json({
    status: 200,
    message: "Connexion réussie.",
    data: { token },
  });
});

// Ajouter / modifier un commentaire
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      status: 404,
      error: "Not Found",
      message: `Aucun livre trouvé pour l'ISBN "${isbn}".`,
    });
  }

  if (!review) {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: "L'avis est requis.",
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    status: 200,
    message: "Avis ajouté/modifié avec succès.",
    data: { reviews: books[isbn].reviews },
  });
});

// Supprimer un commentaire
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      status: 404,
      error: "Not Found",
      message: `Aucun livre trouvé pour l'ISBN "${isbn}".`,
    });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      status: 404,
      error: "Not Found",
      message: "Aucun avis à supprimer pour cet utilisateur.",
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    status: 200,
    message: "Avis supprimé avec succès.",
    data: { reviews: books[isbn].reviews },
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;