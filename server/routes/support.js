const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');

router.post('/message', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    try {
        const admin = await User.findOne({ role: 'ADMIN' });

        if (!admin) {
            console.log('No admin found to receive support notification');
            return res.json({ msg: 'Message received. We will get back to you soon!' });
        }

        const newNotification = new Notification({
            user: admin._id,
            title: `New Support Message from ${name}`,
            message: `From: ${email}\nMessage: ${message}`,
            type: 'SUPPORT_MESSAGE'
        });

        await newNotification.save();

        res.json({ msg: 'Message sent successfully! Our team has been notified.' });
    } catch (err) {
        console.error('Support Route Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
