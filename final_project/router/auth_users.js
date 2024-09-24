const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in" + "the token is : " + accessToken);
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  // Check if review is missing
  if (!review) {
    return res.status(404).json({ message: "Error adding review" });
  }
  // Check if the book with the given ISBN exists
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  // Add the review to the book book.reviews.push is not a function it's a json object
  book.reviews = { "author": req.session.authorization.username, "review": review };
  return res.status(200).json({ message: "Review added successfully" });
});

// Delete a book review ilter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  // Check if the book with the given ISBN exists
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  // Check if the user is the author of the review
  if (book.reviews.author === req.session.authorization.username) {
    // Delete the review
    delete book.reviews;
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Unauthorized to delete review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
