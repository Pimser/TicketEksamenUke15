const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ticketSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    }
})

ticketSchema.post("save", function(doc, next) {
    console.log("New ticket has been published:", doc);
    next();
})

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
