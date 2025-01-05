const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "17f21a0436",
    database: process.env.DB_NAME || "branch_management",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to the MySQL database.");
    connection.release();
});

// Routes
app.get("/branches", (req, res) => {
    const sql = "SELECT * FROM branches";
    pool.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query error", details: err.message });
        }
        return res.json(data);
    });
});

app.post('/branches', (req, res) => {
    const { name, code, location } = req.body;
    const sql = 'INSERT INTO branches (name, code, location) VALUES (?, ?, ?)';
    pool.query(sql, [name, code, location], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database insert error", details: err.message });
        }
        res.json(result);
    });
});

app.put('/branches/:id', (req, res) => {
    const { id } = req.params;
    const { name, code, location } = req.body;
    const sql = 'UPDATE branches SET name = ?, code = ?, location = ? WHERE id = ?';
    pool.query(sql, [name, code, location, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database update error", details: err.message });
        }
        res.json(result);
    });
});

app.delete('/branches/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM branches WHERE id = ?';
    pool.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database delete error", details: err.message });
        }
        res.json(result);
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.send('OK');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
