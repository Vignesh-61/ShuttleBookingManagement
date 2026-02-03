require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/shuttles', require('./routes/shuttles'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/support', require('./routes/support'));
app.use('/api/feedback', require('./routes/feedback'));

app.get('/', (req, res) => {
    res.send('Smart Shuttle Server is Running!');
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
