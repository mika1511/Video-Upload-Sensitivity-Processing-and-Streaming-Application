const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // ✅ MANUAL HASH (no pre-save needed)
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ 
      email, 
      password: hashedPassword,
      role: 'user'
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { id: user._id, email, role: user.role } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { id: user._id, email, role: user.role || 'user' } 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
