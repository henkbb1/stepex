const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const path = require('path');
const commentRoutes = require('./commentRouter');

const PORT = 8000;

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://test:123@cluster0.vautdrq.mongodb.net/');
        app.listen(PORT, () => console.log('server started'));
    }
    catch(e) {
        console.error(e);
    }
}
start();