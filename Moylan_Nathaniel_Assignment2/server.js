var data = require('./Public/product_data.js'); // Links to product_data.js 
var products = data.products; // Loads project data as var products
const qs = require('qs'); 
var express = require('express'); // Loads the Express module
var app = express(); // Starts express
var myParser = require("body-parser"); // Grants access 

// Borrowed and modified from Lab 14, Prof. Port's screencast 
var filename = 'user_data.json'; 
var fs = require('fs'); 
const{request} = require('express');

app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path); 
    next(); // Continue
});

app.use(myParser.urlencoded({ extended: true })); // Gets data from body

var user_data_file = './user_data.json';
// Borrowed and modified from Lab 14, Prof. Port's screencasts 
if(fs.existsSync(filename)) {
    var file_stats = fs.statSync(filename)
    // loads user data file
    var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8'));
    console.log(`${user_data_file} has ${file_stats["size"]} characters`);
} else {
    console.log(`${user_data_file} does not exist!`);
}

app.post("/process_login", function (req, res) {
    var LogError = [];
    console.log(req.query);
    username = req.body.username.toLowerCase(); // Usernames are lowercase
        if (typeof user_data[username] != 'undefined') { // states username and password should not be undefined
        if (user_data[username].password == req.body.password) {
            req.query.username = username; 
            console.log(user_data[req.query.username].name);
            req.query.fullname = user_data[req.query.username].name
            res.redirect('./invoice.html?' + qs.stringify(req.query));
                // Redirects to invoice if username and password are correct
            return; 
        } else { // If password is incorrect, shows 'Invalid Password'
            LogError.push = ('Invalid Password');
            console.log(LogError);
            req.query.username= username;
            req.query.name= user_data[username].name;
            req.query.LogError=LogError.join(';');
        }
        } else { // If username is incorrect, shows 'Invalid password'
            LogError.push = ('Invalid Username');
            console.log(LogError);
            req.query.username= username;
            req.query.LogError=LogError.join(';');
        }
    res.redirect('./login.html?' + qs.stringify(req.query)); // If error is present, remain on the login page
    });

// -------------- Processing Registration ------------- // 
// Borrowed and modified from Lab 14 //
app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];
        if (/^[A-Za-z]+$/.test(req.body.name)) { // Only allows letters to be used for full names
        }
        else {
            errors.push('Use Only Letters for Full Name')
        }
        // Validate whether or not it is a full name
        if (req.body.name == "") {
            errors.push('Invalid Full Name');
        }
// character length should be between 0 and 25 
        if ((req.body.fullname.length > 25 && req.body.fullname.length <0)) {
            errors.push('Full Name Too Long')
        }
// Checks the new username in lowercase across other usernames
    var userreg = req.body.username.toLowerCase(); 
        if (typeof user_data[userreg] != 'undefined') { 
            errors.push('Username taken')
        }
        // Requires usernames to be letters and numbers 
        if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
        }
        else {
            errors.push('Letters And Numbers Only for Username')
        }
// ------------------------ E-Mail Validation ------------------------ //
// Borrowed and modified from Lab 14 // 
    // Password must be at least 6 characters // 
        if (req.body.password.length < 6) {
            errors.push('Password Too Short')
        }
        // Checks to see that the password was entered correctly both times
        if (req.body.password !== req.body.repeat_password) { 
            errors.push('Password Not a Match')
        }
// Borrowed and modified from Lab 14 // 
    // If no errors are present, save username
    req.query.fullname = req.body.fullname;
    req.query.username = req.body.username;
    req.query.email = req.body.email; 
        if (errors.length == 0) {
            console.log('no errors')
            var username = req.body.username;
            user_data[username] = {}; // Register it as user's information
            user_data[username].name = req.body.fullname;
            user_data[username].password= req.body.password; // POST user's password
            user_data[username].email = req.body.email; // POST user's email
            data = JSON.stringify(user_data);  // Make it to user's information
            fs.writeFileSync(filename, data, "utf-8");
            res.redirect('./invoice.html?' + qs.stringify(req.query));
        }
// Borrowed and modified from Lab 14 // 
    // If errors are present, log the user into the console, redirect to registration page
        else {
            console.log(errors)
    req.query.errors = errors.join(';');
    res.redirect('register.html?' + qs.stringify(req.query));
    }
});
app.post("/order_form", function (request, response) {
    let POST = request.body; 

// Check if the quantities are NonNegInt
if (typeof POST['submitPurchase'] != 'undefined') {
        var hasvalidquantities = true; 
        var hasquantities = false
        for (i = 0; i < products.length; i++) {
            
qty=POST[`quantity${i}`];
    hasquantities = hasquantities || qty>0; // If value is > 0, then it is valid
    hasvalidquantities = hasvalidquantities && isNonNegInt(qty); // If quantity is both > 0 and valid
    } 
// Borrowed from Prof. Port's screencast "Getting Started With Assignment 2"
const stringified = qs.stringify(POST); // If all quantities are valid then go to login.html 
    if (hasvalidquantities && hasquantities) {
        response.redirect("./login.html?" + stringified); 
        // Directs user from products_display.html to login.html 
    } else { 
        response.redirect("./products_display.html?" + stringified) 
        }
    }
});

function isNonNegInt(q, return_errors = false) { // Checks to see if inputted values are positive, an integer, or a whole value
    errors = []; // Assumes no errors AT FIRST
    if (q == '') q = 0; 
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if the string is a number value
    else if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if the string is non-negative
    else if (parseInt(q) != q) errors.push('<font color="red">Not a full value!</font>'); 
    // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./Public'));
app.listen(8080, () => console.log(`listening on port 8080`));