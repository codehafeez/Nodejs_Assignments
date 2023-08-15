const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const { connectToDatabase } = require('./db');
const { getAllStudents, createStudent, updateStudent, deleteStudent, getStudent } = require('./student');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(methodOverride('_method'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Connect to MongoDB
(async () => {
  await connectToDatabase();

  // Home page - list all students
  app.get('/', async (req, res) => {
    try {
      const students = await getAllStudents();
      res.render('index', { students });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Error fetching students' });
    }
  });

  // Render create student form
  app.get('/students/new', (req, res) => {
    res.render('new');
  });

  // Create a new student
  app.post('/students', upload.single('image'), async (req, res) => {
    const { name, age, father_name, gender } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !age || !father_name || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const student = {
      name,
      age: parseInt(age),
      father_name,
      gender,
      image,
    };

    try {
      await createStudent(student);
      res.redirect('/');
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ error: 'Error creating student' });
    }
  });

  // Update a student by ID
  app.put('/students/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const { name, age, father_name, gender } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !age || !father_name || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updates = {
      name,
      age: parseInt(age),
      father_name,
      gender,
      image,
    };

    try {
      await updateStudent(id, updates);
      res.redirect('/');
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Error updating student' });
    }
  });

  // Delete a student by ID
  app.delete('/students/:id', async (req, res) => {
    const id = req.params.id;
    try {
      await deleteStudent(id);
      res.redirect('/');
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Error deleting student' });
    }
  });

  // Edit student - Render edit form
  app.get('/students/:id/edit', async (req, res) => {
    const id = req.params.id;
    try {
      const student = await getStudent(id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.render('edit', { student });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ error: 'Error fetching student' });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
