var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var parser = require('body-parser');
app.use(parser.urlencoded({ extended: false }))


// mysql connection - start
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb_nodejs"
});
// mysql connection - end





app.get('/', function(req, res) {
    const query = `select * from students`;
    con.query(query, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/index', { users: result });
      });
});



app.post('/add', function(req, res) {
    var name = req.body.name;
    var age = req.body.age;
    const query = "insert into students (name, age) values ('"+name+"', '"+age+"')";
    con.query(query, function (err, result) {
        if (err) throw err;
        res.redirect('/');
      });
});



app.get('/delete/:id', function(req, res) {
    var id = parseInt(req.params.id);
    const query = "DELETE FROM students WHERE id="+id;
    con.query(query, function (err, result) {
        if (err) throw err;
        res.redirect('/');
      });
});



app.get('/edit/:id', function(req, res) {
    var id = parseInt(req.params.id);
    const query = "SELECT * FROM students WHERE id="+id;
    con.query(query, function (err, result) {
        if (err) throw err;
            console.log('edit user by id : '+id);
            var id = result[0].id;
            var name = result[0].name;
            var age = result[0].age;
            res.render('pages/edit', { id:id, name:name, age:age });
      });
});


app.post('/update', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var age = req.body.age;
    const query = "UPDATE students SET name='"+name+"', age='"+age+"' WHERE id="+id;
    con.query(query, function (err, result) {
        if (err) throw err;
        res.redirect('/');
      });
});



app.listen(8080);
