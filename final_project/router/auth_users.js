const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "your_secret_key"; // Replace with a secure key

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: 60 * 60 });

  // Store token in session
  req.session.authorization = { accessToken: token };

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(!isbn){
    return res.status(200).json({message: "Enter a proper isbn number"});
  }
  const review = req.body.review;
  if(!review){
    return res.status(200).json({message: "Enter a proper review in then body"});
  }
  const username = req.body.username;
  books[isbn].reviews[username] = review;
   return res.status(200).json({ message: "Review added/updated successfully!", reviews: books[isbn].reviews });
});
regd_users.delete("/auth/delete/:isbn",(req,res)=>{
  const isbn = req.params.isbn;
  if(!isbn){
    return res.status(200).json({message: "Enter a proper isbn number"});
  }
   const username = req.body.username;
   delete books[isbn].reviews[username];
   return res.status(200).json({ message: "Review deleted successfully!", reviews: books[isbn].reviews });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
