const express = require("express");
const { getAllTasks, createTask, updateTask, deleteTask } = require("../services/taskService");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks from the database.
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
 */
router.get("/", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
 *         description: The created task.
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = {
      id: uuidv4(),
      title,
      description,
      assignedTo,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    const newTask = await createTask(task);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update the details of a specific task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The task ID.
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
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *     responses:
 *       200:
 *         description: The updated task.
 */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTask = req.body;
    const task = await updateTask(id, updatedTask);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Remove a specific task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The task ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteTask(id);
    res.status(200).send("Task deleted successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
