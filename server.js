require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cors = require('cors');




const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then((result) => {
        console.log("Tilkoblet til MongoDB");
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Serveren kjører på port ${PORT}!`);
        });

    })
    .catch((err) => console.log(err));


    app.use(authRoutes);
app.use(ticketRoutes);

app.use((req, res, next) => {
    const token = req.cookies?.jwt;
    
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log("JWT verification error:", err.message);
                res.locals.username = null;
                next();
            } else {
                try {
                    const user = await User.findById(decodedToken.id);
                    res.locals.username = user ? user.username : null;
                } catch (error) {
                    console.log("Error fetching user:", error);
                    res.locals.username = null;
                }
                next();
            }
        });
    } else {
        res.locals.username = null;
        next();
    }
});

app.get("/", async (req, res) => {
    res.render("index");
});

