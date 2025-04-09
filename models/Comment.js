const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",  
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
