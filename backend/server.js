
const mongoose = require('mongoose');


const MONGO_URL ="mongodb+srv://aparna:hunny%4022@todo.mnxqvqe.mongodb.net/todo-db?retryWrites=true&w=majority";



const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

mongoose.connect(MONGO_URL);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //profileimg: { type: String, default: 'base64-default-image' },
  status: { type: String, default: 'active' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

