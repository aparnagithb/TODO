const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: '*',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
}));

const MONGO_URL = "mongodb+srv://aparna:hunny%4022@todo.mnxqvqe.mongodb.net/todo-db?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL).then(() => {
  console.log('Connected to MongoDB successfully.');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'active' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  priorityFlag: { type: Number, required: true },
  timeLimit: { type: Date, required: true },
  finishTime: { type: Date },
  completed: { type: Boolean, default: false },
  username: { type: String, required: true } // Add username field


}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered', user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    res.send({ message: 'User logged in', user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.send({ categories });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const category = new Category({ name, icon, color });
    await category.save();
    res.status(201).send({ message: 'Category created', category });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, category, priorityFlag, timeLimit, finishTime, username } = req.body; // Added username here
    const task = new Task({ title, description, category, priorityFlag, timeLimit, finishTime, username }); // Include username in the Task creation
    await task.save();
    res.status(201).send({ message: 'Task created', task });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
app.get('/tasks', async (req, res) => {
  try {
    const { username } = req.query; // Get the username from query parameters
    const tasks = await Task.find({ username }).populate('category'); // Filter tasks by username
    res.send({ tasks });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priorityFlag, timeLimit, finishTime, completed } = req.body;
    const updateFields = { title, description, category, priorityFlag, timeLimit, finishTime };
    
    // Add completed status if provided (for handleCheckboxChange function)
    if (completed !== undefined) {
      updateFields.completed = completed;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    res.send({ message: 'Task updated', task: updatedTask });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
