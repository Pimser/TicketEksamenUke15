const Router = require("express");
const authController = require("../controller/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

//Get 
router.get("/about", authController.about_get);
router.get("/signup", authController.signup_get);
router.get("/login", authController.login_get);
router.get("/logout", authController.logout_get);
router.get("/faq", authController.faq_get);


//Post
router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);

module.exports = router;
