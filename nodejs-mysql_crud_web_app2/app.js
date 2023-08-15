const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


// Start - DB Connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hafeez_db"
});
// End - DB Connection


// Start - Image upload setup using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// End - Image upload setup using multer



// Start - use static data
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// End - use static data




app.get('/', function(req, res) {
  const query = `SELECT * FROM students`;
  con.query(query, function (err, result) {
    if (err) throw err;
    res.render('pages/index', { users: result });
  });
});


app.post('/add', upload.single('image'), function(req, res) {
  const name = req.body.name;
  const age = req.body.age;
  const image = req.file.filename;
  const query = "INSERT INTO students (name, age, image) VALUES (?, ?, ?)";
  const values = [name, age, image];
  con.query(query, values, function (err, result) {
    if (err) throw err;
    res.redirect('/');
  });
});


app.get('/delete/:id', function(req, res) {
  // const id = parseInt(req.params.id);
  const id = req.params.id;
  const query = "DELETE FROM students WHERE id=?";
  con.query(query, [id], function (err, result) {
    if (err) throw err;
    res.redirect('/');
  });
});


app.get('/edit/:id', function(req, res) {
  // const id = parseInt(req.params.id);
  const id = req.params.id;
  const query = "SELECT * FROM students WHERE id=?";
  con.query(query, [id], function (err, result) {
    if (err) throw err;
    console.log('edit user by id : ' + id);
    const user = result[0];
    res.render('pages/edit', { user });
  });
});

app.post('/update/:id', upload.single('image'), function (req, res) {
  const id = req.params.id;
  const name = req.body.name;
  const age = req.body.age;
  let image = req.file ? req.file.filename : undefined;
  
  let query;
  let values;

  if (image) {
    query = `UPDATE students SET name=?, age=?, image=? WHERE id=?`;
    values = [name, age, image, id];
  } else {
    query = `UPDATE students SET name=?, age=? WHERE id=?`;
    values = [name, age, id];
  }

  con.query(query, values, function (err, result) {
    if (err) throw err;
    res.redirect('/');
  });
});


app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
