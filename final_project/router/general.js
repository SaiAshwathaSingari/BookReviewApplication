const express = require('express');
let books = require("./booksdb.js");
const { sign } = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');
public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
for(let i =0;i<users.length;i++){
 if(users[i].username===username){
  return res.status(409).json({message: "Username already exists"});
 }}
  users.push({username,password});
   return res.status(201).json({ message: "User registered successfully." })
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve,reject)=>{
    if(Object.keys(books).length>0){
      resolve(books);
    }else{
      reject(new Error("No books found"));
    }
  })
  .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn && isbn>0){
    return res.status(400).json({message: "Enter a valid isbn"});
  }
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found."));
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ message: error.message }));
  
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = (req.params.author || "").trim();
  if (!author) {
    return res
      .status(400)
      .json({ message: "Author parameter is required." });
  }

  // 1) Get an array of all book objects
  const allBooks = Object.values(books);

  // 2) Collect *every* book whose author matches
  const matches = allBooks.filter(
    b => b.author.toLowerCase() === author.toLowerCase()
  );

  // 3) If none, 404
  if (matches.length === 0) {
    return res
      .status(404)
      .json({ message: "No books found by that author." });
  }

  // 4) Otherwise, 200 + array of matches
  return res.status(200).json(matches);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if(!title){
    return res.status(400).json({message: "Enter a proper title name"});
  }
  let arr = Object.values(books);
  const ans = arr.filter(
    a => a.title.toLocaleLowerCase()===title.toLocaleLowerCase()
  );
  if(ans.length==0){
    return res.status(400).json({message: "Not found the book with that tile"});
  }
  return res.status(200).json(ans);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn){
    return res.status(400).json({message: "Enter a correct ISBN"});
  }
  return res.status(200).json(books[isbn].reviews);
  
});

module.exports.general = public_users;
