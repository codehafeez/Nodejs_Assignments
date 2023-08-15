// load the things we need
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    
    var users = [
        { name: 'Abdul', age:20},
        { name: 'Hafeez', age:24},
        { name: 'Noman', age:18},
        { name: 'Usman', age:22},
    ];

    var tagline = "test message hello world";

    res.render('pages/index', {
        users: users,
        tagline: tagline
    });
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});


app.get('/delete/:id', function(req, res) {
    console.log('delete user by id : '+req.params.id);
    res.render('pages/about');
});

app.listen(8080);
