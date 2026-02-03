const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/email');


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            phone: phone || '',
            password: hashedPassword,
            role: role || 'PASSENGER'
        });

        await user.save();

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        await sendEmail(
            email,
            'Your OTP for Smart Shuttle',
            `Your OTP is: ${otp}. It is valid for 10 minutes.`
        );

        res.json({ msg: 'OTP sent! Please check the server console.' });
    } catch (err) {
        console.error('OTP Send Error:', err.message);
        res.status(500).send('Server error');
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ msg: 'OTP expired or not found' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }

        await OTP.deleteOne({ _id: otpRecord._id });

        res.json({ msg: 'OTP verified successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const auth = require('../middleware/auth');

router.get('/users', auth, async (req, res) => {
    try {

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
