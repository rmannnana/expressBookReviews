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

//Uniquement pour les utilisateur déjà inscrits
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Identifiants incorrects." });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

  req.session.authorization = { accessToken: token, username };

  return res.status(200).json({ message: "Connexion réussie.", token });
});

// Ajouter un commentaire
regd_users.put("/auth/review/:isbn", (req, res) => {
  //code
  return res.status(300).json({ message: "À implementer" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
