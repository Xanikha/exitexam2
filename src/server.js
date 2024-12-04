// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todolist', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Task Schema
const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean
});

// Task Model
const Task = mongoose.model('Task', taskSchema);

// Routes

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(400).send('Error fetching tasks: ' + err);
  }
});

// Add a new task
app.post('/tasks', async (req, res) => {
  const { description, completed } = req.body;

  const newTask = new Task({
    description,
    completed: completed || false
  });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).send('Error adding task: ' + err);
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send('Task deleted');
  } catch (err) {
    res.status(400).send('Error deleting task: ' + err);
  }
});

// Update task completion status
app.put('/tasks/:id', async (req, res) => {
  const { completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { completed }, 
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).send('Error updating task: ' + err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
