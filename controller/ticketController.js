const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Ticket = require("../models/Ticket");

module.exports.createTicket_get = (req, res) => {
    res.render("createTicket");
}

module.exports.createTicket_post = async (req, res) => {
    const {title, description, tag, status} = req.body;

    console.log(req.body);

    try {
        const user = await User.findById(req.user.id); 
        const {username} = user; 
        const ticket = await Ticket.create({title, description, tags: tag, status});
        const tickets = await Ticket.findOne(ticket);
        res.status(201).render("dashboard", {ticket, username, tickets});
    } catch (err) {
        console.log("error posting ticket:", err);
    }
}

module.exports.dashboard_get = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send("Unauthorized: User not found");
        }

        const tickets = await Ticket.find(); 
        const user = await User.findById(req.user.id);
        const username = user.username;
        if ( user.role == "admin") {
            res.render("adminDashboard", { tickets, user, username}); 

        } else {
            res.render("dashboard", { tickets, user, username}); 
        }
    } catch (err) {
        console.log("Error fetching tickets:", err);
        res.status(500).send("Server error");
    }
}

module.exports.ticket_id_get = async (req, res) => {
    try {
        const tick = await Ticket.findById(req.params.id);
        const user = req.user;
        res.render("ticket-details", { tick, user });
      } catch (err) {
        res.status(404).send("No tickets found!");
      }
}

module.exports.adminDashboard_get = async (req, res) => {
    try {
        const tickets = await Ticket.find(); 
        const user = await User.findById(req.user.id);
        const username = user.username;
        if (user.role == "admin") {
            console.log("Admin is in dashboard");
            res.render("adminDashboard", {tickets, user, username});
        } else {
            console.log("User in not admin!");
            res.render("dashboard", {tickets, user, username});
        }
    }
    catch (err) {
        console.log("Error occured when trying to access adminDashboard", err);

    }
}

module.exports.closeTicket = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(req.user.id);

        console.log(user, "ID", req.body);


        if (user.role !== "admin") {
            return res.status(403).send("Unauthorized: You do not have permission to close this ticket");
        } else {
            const ticket = await Ticket.findByIdAndUpdate(id, { status: "closed" }, { new: true });
            if (!ticket) {
                return res.status(404).send("Ticket not found");
            }

            res.redirect("/adminDashboard");
        }

        
    } catch (err) {
        console.log("Error closing ticket:", err);
        res.status(500).send("Server error: Unable to close the ticket");
    }
}

module.exports.openTicket = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(req.user.id);

        if (user.role !== "admin") {
            return res.status(403).send("Unauthorized: You do not have permission to open this ticket");
        } else {
            const ticket = await Ticket.findByIdAndUpdate(id, { status: "open" }, { new: true });
            if (!ticket) {
                return res.status(404).send("Ticket not found");
            }

            res.redirect("/adminDashboard");
        }

        
    } catch (err) {
        console.log("Error opening ticket:", err);
        res.status(500).send("Server error: Unable to close the ticket");
    }
}