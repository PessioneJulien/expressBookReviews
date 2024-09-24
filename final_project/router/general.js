const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop using async/await 
public_users.get('/', async function (req, res) {
  try {
    // Simulate an api call
    const booksData = await new Promise((resolve, reject) => {
      // Simulate a delay
      setTimeout(() => {
        resolve(books);
      }, 100);
    });
    return res.status(200).json(booksData);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
  //return res.status(200).json(books);
});


// Get book details based on ISBN using async/await 
public_users.get('/isbn/:isbn', async function (req, res) {
  try { // Simulate an api call
    const isbn = req.params.isbn;
    const bookData = await new Promise((resolve, reject) => {
      // Simulate a delay
      setTimeout(() => {
        resolve(books[isbn]);
      }, 100);
    }
    );
    if (bookData) {
      return res.status(200).json(bookData);
    }
    else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
  }
  //const isbn = req.params.isbn;
  //if (books[isbn]) {
  //  return res.status(200).json(books[isbn]);
  //} else {
  //  return res.status(404).json({ message: "Book not found" });
  //}
});

// Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const bookData = await new Promise((resolve, reject) => {
      // Simulate a delay
      setTimeout(() => {
        resolve(Object.values(books).filter(book => book.author === author));
      }, 100);
    }
    );
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching book", error: error.message
    });
  }
  //const author = req.params.author;
  //const filteredBooks = Object.values(books).filter(book => book.author === author);
  //return res.status(200).json(filteredBooks);
});

// Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const bookData = await new Promise((resolve, reject) => {
      // Simulate a delay
      setTimeout(() => {
        resolve(Object.values(books).filter(book => book.title === title));
      }, 100);
    }
    );
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
  }
  //const title = req.params.title;
  //const filteredBooks = Object.values(books).filter(book => book.title === title);
  //return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
