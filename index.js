const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const taskRoutes = require("./routes/tasks");
const setupSwaggerDocs = require("./swagger");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Task management SaaS Backend is running! Visit /api-docs for API documentation.");
});

// Task Routes
app.use("/tasks", taskRoutes);

// Swagger Docs
setupSwaggerDocs(app);

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
