const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id/read', auth, async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await notification.deleteOne();

        res.json({ msg: 'Notification removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
