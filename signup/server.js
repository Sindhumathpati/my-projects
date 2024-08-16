const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const path = require('path');

const app = express();
const port = 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public', '/index.html');
  });

  app.post('/signup', async (req, res) => {
    const { firstname,lastname, email, password } = req.body;
  
    if (!firstname|| !lastname || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (firstname,lastname, email, password) VALUES (?, ?, ?,?)';
  db.query(query, [firstname,lastname, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user into database:', err);
      return res.status(500).send('Internal server error');
    }
    res.send('User registered successfully');
  });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });