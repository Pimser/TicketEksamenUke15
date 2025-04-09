const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Ticket = require("../models/Ticket");
const Comment = require("../models/Comment");


module.exports.getAllUsers = async (req, res) => {
    try {
        // if (req.user.role !== 'admin') {
        //     return res.status(403).send("Access denied. Admins only.");
        // }

        const users = await User.find();
        const user = await User.findById(req.user.id);
        const username = user.username;

        res.render("get-all-users", { users, user, username });

    } catch (err) {
        console.log("Error fetching users:", err);
        res.status(500).send("Server error");
    }
};