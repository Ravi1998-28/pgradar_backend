import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Token generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user (either 'user' or 'owner')
export const registerUser = async (req, res) => {
  const { name, email, password, role = 'user', business_name, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUserData = {
      name,
      email,
      password,
      role
    };

    if (role === 'owner') {
      if (!business_name || !phone) {
        return res.status(400).json({ message: 'Business name and phone are required for owners' });
      }
      newUserData.business_name = business_name;
      newUserData.phone = phone;
    }

    const user = await User.create(newUserData);
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      business_name: user.business_name,
      token
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User with this email does not exist' });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry on user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // You would email this link in production
    const resetLink = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

    res.status(200).json({
      message: 'Reset link generated',
      resetLink, // remove this in production and send via email
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
