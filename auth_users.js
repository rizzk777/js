const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// ✅ Check if username already exists
const isValid = (username) => { 
  return users.some(user => user.username === username);
};

// ✅ Authenticate user’s username and password
const authenticatedUser = (username, password) => { 
  return users.some(user => user.username === username && user.password === password);
};

// ✅ LOGIN route (Task 7)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Create JWT token
    let accessToken = jwt.sign(
      { username: username },
      "access", // Secret key
      { expiresIn: '1h' }
    );
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password." });
  }
});

// ✅ ADD or MODIFY a book review (Task 8) using Bearer Token
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const username = decoded.username;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  });
});

// ✅ DELETE a review (Task 9) using Bearer Token
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const username = decoded.username;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "No review found for this user" });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
