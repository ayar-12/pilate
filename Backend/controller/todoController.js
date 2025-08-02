const Todo = require('../models/todolist');
const path = require('path');
const fs = require('fs');

// GET all todos for logged-in user
exports.getUserTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching todos:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch todos' });
  }
};

// CREATE new todo
exports.createTodo = async (req, res) => {
  try {
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newTodo = new Todo({
      user: req.user._id,
      title: req.body.title.trim(),
      subtitle: req.body.subtitle?.trim() || '',
      date: req.body.date || '',
      time: req.body.time || '',
      image: req.file ? `/uploads/todo/${req.file.filename}` : null
    });

    await newTodo.save();

    res.status(201).json({ 
      success: true, 
      data: newTodo,
      message: 'Todo created successfully'
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('CREATE TODO ERROR:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create todo'
    });
  }
};

// TOGGLE done status
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;

    if (typeof done !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Done status must be a boolean' });
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { done },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Todo not found or not yours' });
    }

    res.json({ success: true, data: updated, message: 'Todo updated successfully' });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('UPDATE TODO ERROR:', err);

    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid todo ID format' });
    }

    res.status(500).json({ success: false, message: 'Failed to update todo' });
  }
};

// FULL edit (title, subtitle, time, image)
exports.editTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, date, time } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const updateData = {
      title: title.trim(),
      subtitle: subtitle?.trim() || '',
      date: date || '',
      time: time || ''
    };

    if (req.file) {
      updateData.image = `/uploads/todo/${req.file.filename}`;
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Todo not found or not yours' });
    }

    res.json({ success: true, data: updated, message: 'Todo updated successfully' });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('EDIT TODO ERROR:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ')
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid todo ID format' });
    }

    res.status(500).json({ success: false, message: 'Failed to edit todo' });
  }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found or not yours' });
    }

    if (todo.image) {
      const imagePath = path.join(__dirname, '..', todo.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        if (process.env.NODE_ENV === 'development') {
          console.log('Deleted image file:', imagePath);
        }
      }
    }

    await Todo.findByIdAndDelete(id);

    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('DELETE TODO ERROR:', err);

    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid todo ID format' });
    }

    res.status(500).json({ success: false, message: 'Failed to delete todo' });
  }
};
