import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// 🔐 JWT टोकन जनरेट करने का फंक्शन
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2d' }
  );
};

// 📝 POST /api/auth/register (नया यूजर बनाने के लिए)
export const register = async (req, res) => {
  try {
    // फ्रंटएंड से आने वाले डेटा को रिसीव करें
    const { username, email, password, role } = req.body;

    // 1. बेसिक वैलिडेशन (अगर डेटा मिसिंग है तो यहीं रोक दें)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    // 2. चेक करें कि यूजर या ईमेल पहले से तो नहीं है
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // 3. नया यूजर ऑब्जेक्ट बनाएं 
    // (password को मॉडल की password फील्ड में मैप करें)
    const user = new User({ 
        username, 
        email, 
        password: password, 
        role: role || 'User' 
    });
    
    // 4. डेटाबेस में सेव करें
    await user.save();

    // 5. टोकन बनाकर रिस्पॉन्स भेजें
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// 🔑 POST /api/auth/login (लॉगिन करने के लिए)
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // यूजर को डेटाबेस में ढूंढें
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // पासवर्ड चेक करें
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// 👥 GET /api/auth/users (सभी यूजर्स की लिस्ट)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

// 🗑️ DELETE /api/auth/users/:id (यूजर डिलीट करें)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};