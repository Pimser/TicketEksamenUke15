const {Router} = require("express");
const ticketController = require("../controller/ticketController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

//get
router.get("/createTicket", requireAuth, ticketController.createTicket_get);
router.get("/dashboard", requireAuth, ticketController.dashboard_get);
router.get("/tickets/:id", requireAuth, ticketController.ticket_id_get);
router.get("/adminDashboard", requireAuth, ticketController.adminDashboard_get);



//post
router.post("/createTicket", requireAuth, ticketController.createTicket_post);
router.post("/close", requireAuth, ticketController.closeTicket);
router.post("/open", requireAuth, ticketController.openTicket);

module.exports = router;