const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// ======================================
// ✅ Task 6 - Register new user
// ======================================
let users = [];
const isValid = (username) => users.some(u => u.username === username);

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// ======================================
// ✅ Task 10 - Get all books (async callback)
// ======================================
public_users.get('/', async (req, res) => {
  try {
    // Simulate async callback (e.g., DB read)
    const getBooks = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(books), 500);
      });

    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// ======================================
// ✅ Task 11 - Get book details by ISBN (Promise)
// ======================================
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  const getBookByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    }, 500);
  });

  getBookByISBN
    .then(book => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch(err => res.status(404).json({ message: err }));
});

// ======================================
// ✅ Task 12 - Get book details by Author (Promise)
// ======================================
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      let result = [];
      Object.keys(books).forEach(isbn => {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
          result.push(books[isbn]);
        }
      });
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    }, 500);
  });

  getBooksByAuthor
    .then(result => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch(err => res.status(404).json({ message: err }));
});

// ======================================
// ✅ Task 13 - Get book details by Title (Promise)
// ======================================
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  const getBooksByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      let result = [];
      Object.keys(books).forEach(isbn => {
        if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
          result.push(books[isbn]);
        }
      });
      if (result.length > 0) resolve(result);
      else reject("No books found with this title");
    }, 500);
  });

  getBooksByTitle
    .then(result => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch(err => res.status(404).json({ message: err }));
});

// ======================================
// ✅ Task 5 - Get book review (already part of earlier task)
// ======================================
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
