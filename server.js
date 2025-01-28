const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("./firebase/firebaseConfig");
require("dotenv").config();
const {v4: uuidv4} = require("uuid");
const setupSwagger = require("./swagger");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
setupSwagger(app);

const db = admin.firestore();

//API: get all tasks
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks in the database.
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The task ID.
 *                   title:
 *                     type: string
 *                     description: The task title.
 *                   description:
 *                     type: string
 *                     description: The task description.
 *                   assignedTo:
 *                     type: string
 *                     description: The user the task is assigned to.
 *                   status:
 *                     type: string
 *                     description: The task status.
 *                   createdAt:
 *                     type: string
 *                     description: The creation date of the task.
 *       500:
 *         description: Internal server error.
 */
app.get("/tasks", async (req, res) => {
    try {
        const snapshot = await db.collection("tasks").get();
        const tasks = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

//example route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Task Management SaaS Backend!",
        availableRoutes: {
          "GET /tasks": "Get all tasks",
          "POST /tasks": "Create a new task",
          "PUT /tasks/:id": "Update a task by ID",
          "DELETE /tasks/:id": "Delete a task by ID",
        },
      });
});

// API: create a new task
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Add a new task to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *               assignedTo:
 *                 type: string
 *                 description: The user assigned to the task.
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       500:
 *         description: Internal server error.
 */
app.post("/tasks", async (req, res) => {
    try {
        const {title, description, assignedTo} = req.body;

        const taskId = uuidv4();

        const newTask = {
            id: taskId,
            title,
            description,
            assignedTo,
            status: "Pending",
            createdAt: new Date().toISOString(),
        };

        await db.collection("tasks").doc(taskId).set(newTask);
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

// API: updated the task
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update the details of an existing task.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */
app.put("/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = req.body;

        await db.collection("tasks").doc(taskId).update(updatedTask);
        res.status(200).json({id: taskId, ...updatedTask});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

// API: delete a task
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Remove a task from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */
app.delete("/tasks/:id", async (req,res) => {
    try {
        const taskId = req.params.id;

        await db.collection("tasks").doc(taskId).delete();
        res.status(200).send(" Task deleted Successfully");
    }
    catch( error) {
        res.status(500).json({error: error.message});
    }
});

app.listen(port, () => { console.log(`Server running on http://localhost:${port}`)});