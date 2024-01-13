const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const Post = new Schema({
    username: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: String, required: true},
    comments: {type : mongoose.Schema.Types.ObjectId, require: true,ref: 'Comment'}
})

module.exports = model('Post', Post)