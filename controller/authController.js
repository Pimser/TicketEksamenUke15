const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Ticket = require("../models/Ticket");



const maxAge = 3 * 24 * 60 * 60; //3 dagers levetid
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

const handleErrors = (err) => {
    console.log(err.message, err.code);
    console.log(err, "ERR");
    let errors = { username: "", email: '', password: '' };
  
    if (err.keyValue) {
        if (err.keyValue.username) {

        errors.username = "username taken";
        return errors;
        }else if (err.keyValue.email) {
          errors.email = "email taken";

        } 
    }

    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
}

module.exports.about_get = (req, res) => {
    res.render("about");
}

module.exports.signup_get = (req, res) => {
    res.render("signup", {errors: {}, user: null, username: null });
}

module.exports.signup_post = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const user = await User.create({username, email, password});
        const token = createToken(user._id);
        res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).render("index", {user: user._id, errors: {}, username });
    } catch (err) {
        const errors = handleErrors(err);
        console.log("error", errors)
    }
}

module.exports.login_get = (req, res) => {
    res.render("login", {errors: "", user: null, username: null});
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        if (user) {
            const token = createToken(user._id);
            res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000});
            return res.redirect("/"); //sender brukeren til hjemmesiden etter login
        }
    } catch (err) {
        return res.status(400).render("login", {user: null, errors: "Username or password do not exist"});
    }
}


module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", {maxAge: 1});
    res.redirect("/");
}


