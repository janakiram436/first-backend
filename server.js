const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());

app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "17f21a0436",
    database: "branch_management"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to the MySQL database.");
});

app.get("/branches", (req, res) => {
    const sql = "SELECT * FROM branches";
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database query error", details: err.message });
        }
        return res.json(data);
    });
});

// 2. Add a new user
app.post('/branches', (req, res) => {
    const { name, code, location } = req.body;
    const sql = 'INSERT INTO branches (name, code, location) VALUES (?, ?, ?)';
    db.query(sql, [name, code, location], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// 3. Update a user
app.put('/branches/:id', (req, res) => {
    const { id } = req.params;
    const { name, code, location } = req.body;
    const sql = 'UPDATE branches SET name = ?, code = ?, location = ? WHERE id = ?';
    db.query(sql, [name, code, location, id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// 4. Delete a user
app.delete('/branches/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM branches WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
