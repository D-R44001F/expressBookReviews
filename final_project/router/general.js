const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Review by user1 deleted for book: 3."});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    
    // Create a Promise to get the book list
    const getBooksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books); // Resolve with the books object if found
            } else {
                reject("No books available."); // Reject if there are no books
            }
        }, 2000); // Simulate a delay
    });
    
    // Get the book list
    //res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    // Create a Promise to get book details
    const getBookByISBNPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[ISBN]) {
                resolve(books[ISBN]); // Resolve with the book if found
            } else {
                reject("Invalid ISBN."); // Reject if the book is not found
            }
        }, 2000); // Simulate a delay
    });

    /* retrieve ISBN from the request parameters
    const ISBN = req.params.isbn;
    if (books[ISBN]){
        // send the book with the matching ISBN
        res.send(books[ISBN]);
    }else {
        res.send("Invalid.");
    }
    */
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  // Create a Promise to find books by author
  const getBooksByAuthorPromise = new Promise((resolve, reject) => {
        // Convert the books object to an array
        const booksArray = Object.values(books);

        // Filter the books array by author
        let filtered_books = booksArray.filter((book) => book.author === author);
        
        // Resolve or reject based on the filtered results
        if (filtered_books.length > 0) {
            resolve(filtered_books); // Resolve with the found books
        } else {
            reject("No books found for the given author."); // Reject if no books are found
        }
    });  
  
  
  /*if (author) {
        // Convert the books object to an array
        const booksArray = Object.values(books);

        // Filter the books array by author
        let filtered_books = booksArray.filter((book) => book.author === author);
        
        // Check if any books were found
        if (filtered_books.length > 0) {
            res.send(filtered_books);
        } else {
            res.send("No books found for the given author.");
        }
    } else {
        res.send("Invalid or non-existent parameter.");
    }*/

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    
    // Create a Promise to find books by title
    const getBooksByTitlePromise = new Promise((resolve, reject) => {
        if (title) {
            // Convert the books object to an array
            const booksArray = Object.values(books);
  
            // Filter the books array by title
            let filtered_books = booksArray.filter((book) => book.title === title);
            
            // Resolve or reject based on the filtered results
            if (filtered_books.length > 0) {
                resolve(filtered_books); // Resolve with the found books
            } else {
                reject("No books found for this title."); // Reject if no books are found
            }
        } else {
            reject("Invalid or non-existent parameter."); // Reject if the title parameter is missing
        }
    });
    
    /*
    if (title) {
          // Convert the books object to an array
          const booksArray = Object.values(books);
  
          // Filter the books array by author
          let filtered_books = booksArray.filter((book) => book.title === title);
          
          // Check if any books were found
          if (filtered_books.length > 0) {
              res.send(filtered_books);
          } else {
              res.send("No books found for this tittle.");
          }
    } else {
          res.send("Invalid or non-existent parameter.");
        }
    */
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;

    if (ISBN) {
          // Convert the books object to an array
          const booksArray = Object.values(books);
  
          // Filter the books array by author
          let book = booksArray.find((book) => book.isbn === ISBN);
          
          // Check if any books were found
          if (book) {
              res.send(book.reviews);
          } else {
              res.send("No books found for this tittle.");
          }
    } else {
          res.send("Invalid or non-existent parameter.");
        }
});

module.exports.general = public_users;
