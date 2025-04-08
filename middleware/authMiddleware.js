const jwt = require("jsonwebtoken");


const requireAuth = (req, res, next) => {
    const token = req.cookies?.jwt;

    // console.log(token, "TOKEN");

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log("JWT vertification error:", err.message);
                res.redirect("/login");
            } else {
                // console.log("Decoded token:", decodedToken);
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
}

module.exports = { requireAuth };