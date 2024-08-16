const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
dotenv.config();
const path = require('path');
const session = require('express-session');

const app = express();
const port = 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public', '/index.html');
});

app.post('/api/signup', async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body;

    // Check for required fields
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required');
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).send('Please enter a valid email address');
    }

    // Check if email already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Error checking email');
        }

        if (results.length > 0) {
            return res.status(400).send('Email already exists');
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const insertQuery = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [firstname, lastname, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user into database:', err);
                    return res.status(500).send('Internal server error');
                }
                res.send('User registered successfully');
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).send('Internal server error');
        }
    });
});

app.post('api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Error logging in');
        }

        if (results.length > 0) {
            const user = results[0];

            try {
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    req.session.userId = user.id; // Save user ID in session
                    res.type('text/plain'); // Ensure the response type is plain text
                    res.send(`Hi ${user.firstname} ${user.lastname}`);
                } else {
                    console.log('Error: Invalid email or password');
                    res.status(401).send('Invalid email or password');
                }
            } catch (error) {
                console.error('Error comparing passwords:', error);
                res.status(500).send('Internal server error');
            }
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
