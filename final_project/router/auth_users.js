const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

    // Filter the users array for any user with the same username
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

const authenticatedUser = (username,password)=>{ //returns boolean
    
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
regd_users.post("/login", (req,res) => {
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
        }, 'access', { expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log("PUT request received");  // Log to confirm the route is reached
    const ISBN = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username; 
    
    console.log("ISBN:", ISBN);
    console.log("Review:", review);
    console.log("Username:", username);

    const booksArray = Object.values(books);
    let book = booksArray.find((book) => book.isbn === ISBN);

    if (book) { 
        if (!book.reviews) {
            book.reviews = {}; 
        }
        book.reviews[username] = review;
        
        res.send(`Review by ${username} added/modified for book: ${ISBN}.`);
    } else {
        res.send("Unable to find book.");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract ISBN parameter from request URL
    const ISBN = req.params.isbn;

    // Assuming username is stored in session; adjust as necessary for your app
    const username = req.session.username; // Or req.body.username if passed in the request

    // Convert the books object to an array
    const booksArray = Object.values(books);

    // Find the book with the matching ISBN
    let book = booksArray.find((book) => book.isbn === ISBN);

    if (book) { // Check if book exists
        if (book.reviews && book.reviews[username]) {
            // Delete the review for the specific username
            delete book.reviews[username];
            res.send(`Review by ${username} deleted for book: ${ISBN}.`);
        } else {
            res.send("No review found for this user.");
        }
    } else {
        // If the book is not found
        res.send("Unable to find book.");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
