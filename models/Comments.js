const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const Comment = new Schema({
    username: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: String, required: true},
    postId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post',}
})

module.exports = model('Comment', Comment)