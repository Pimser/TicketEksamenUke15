const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Ticket = require("../models/Ticket");
const Comment = require("../models/Comment");

module.exports.createTicket_get = (req, res) => {
    res.render("createTicket");
}

module.exports.createTicket_post = async (req, res) => {
    const {title, description, tag, status} = req.body;

    console.log(req.body);

    try {
        const user = await User.findById(req.user.id); 
        const {username} = user; 
        const ticket = await Ticket.create({title, description, tags: tag, status, user: user._id});
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
        const tick = await Ticket.findById(req.params.id).populate('user', 'username');
        const user = req.user;
        const comments = await Comment.find({ ticket: req.params.id }).populate('user', 'username');
        res.render("ticket-details", { tick, comments }); // <--{user} her hvis du får error
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
            // console.log("Admin is in dashboard");
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

module.exports.userAccount_get = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);  // Bruk ID-en fra URL
        if (!user) {
            return res.status(404).send("User not found");  // Håndterer tilfelle der bruker ikke finnes
        }
        res.render("user-account", { user });  // Sender brukerens data til "user-account.ejs"
    } catch (err) {
        console.log("Error fetching user:", err);
        res.status(500).send("Server error");
    }
};


module.exports.ticketDetails = async (req, res) => {
    try {
        // Henter billett basert på ID fra URL-en
        const ticket = await Ticket.findById(req.params.id);
        
        // Henter kommentarer til denne billetten
        const comments = await Comment.find({ ticket: req.params.id }).populate('user', 'username');

        // Sørg for at du sender både ticket og comments til EJS-siden
        res.render("ticket-details", { ticket, comments });
    } catch (err) {
        console.log("Error fetching ticket details or comments:", err);
        res.status(500).send("Server error");
    }
};

module.exports.addComment = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { content } = req.body;

        const comment = await Comment.create({
            ticket: req.params.id,
            user: req.user.id,
            content
        });
        res.redirect(`/tickets/${req.params.id}`);
    } catch (err) {
        console.log("Error adding comment:", err);
        res.status(500).send("Server error");
    }

};

