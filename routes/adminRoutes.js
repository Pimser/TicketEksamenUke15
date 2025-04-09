const Router = require("express");
const adminController = require("../controller/adminController");
const { requireAuth } = require("../middleware/authMiddleware");
const { getAllUsers } = require("../controller/adminController");

const router = Router();

//get
router.get("/get-all-users", requireAuth, getAllUsers);


//post



module.exports = router;
