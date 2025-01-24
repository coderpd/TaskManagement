
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret"; 


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "taskmanagement",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

// Authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
};



// User Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password,  );
    const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    db.query(query, [username, email, hashedPassword, "User"], (err) => {
      if (err) {
        console.error("Error inserting user into database:", err.message);
        return res.status(500).send("Error registering user");
      }
      res.status(201).send("User registered successfully");
    });
  } catch (err) {
    console.error("Error hashing password:", err.message);
    res.status(500).send("Error registering user");
  }
});

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send("Invalid credentials");
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.send({ token });
  });
});

// Fetch Tasks
app.get("/tasks", authenticate, (req, res) => {
  const query = `SELECT * FROM newtask WHERE user_id = ?`;
  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching tasks");
    } 
    res.send(results);
  });
});

// Fetch Task Statistics (Summary)
app.get("/tasks/stats", authenticate, (req, res) => {
  const query = `SELECT
        COUNT(*) AS total,
        SUM(status = 'Completed') AS completed,
        SUM(status = 'Pending') AS pending,
        SUM(status = 'On Progress') AS onprogress
      FROM newtask WHERE user_id = ?`;

  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching statistics");
    }
    res.send(results[0]);
  });
});

// Static Admin Login Credentials
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin123";

// Admin Login Route
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  // Enforce static admin credentials
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "Admin" }, JWT_SECRET, { expiresIn: "1h" });
    return res.send({ token });
  }

  // Reject all other login attempts
  return res.status(403).send("Invalid admin credentials");
});

// Create Task (Requires Authentication)
app.post("/tasks", authenticate, (req, res) => {
  const { name, priority, dueDate, status } = req.body;

  if (!name || !priority || !dueDate || !status) {
    return res.status(400).send("All fields are required");
  }

  const query = `INSERT INTO newtask (name, priority, due_date, status, user_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [name, priority, dueDate, status, req.user.id], (err) => {
    if (err) {
      console.error("Error creating task:", err.message);
      return res.status(500).send("Error creating task");
    }
    res.status(201).send("Task created successfully");
  });
});


// Fetch All Tasks (Admin Only, Requires Authentication)
app.get("/tasks/all", authenticate, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).send("Forbidden");
  }
  const query = `SELECT tasks.id, tasks.name, tasks.priority, tasks.due_date, tasks.status, users.username
                  FROM newtask tasks
                  JOIN users ON tasks.user_id = users.id`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching tasks");
    }
    res.send(results);
  });
});


// Delete Task (Admin Only, Requires Authentication)
app.delete("/tasks/:id", authenticate, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).send("Forbidden");
  }

  const query = `DELETE FROM newtask WHERE id = ?`;
  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).send("Error deleting task");
    }
    res.send("Task deleted successfully");
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
