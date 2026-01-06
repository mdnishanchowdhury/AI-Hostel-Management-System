const express = require("express");
const router = express.Router();
const {
  initPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  handleIPN,
  getPaymentsByEmail,
  getAllPayments,
  getUnpaidUsers,
} = require("../controllers/paymentController");

const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post("/init", initPayment);
router.post("/success", handleSuccess);
router.post("/fail", handleFail);
router.post("/cancel", handleCancel);
router.post("/ipn", handleIPN);

router.get("/user", getPaymentsByEmail);

// ADMIN
router.get("/", verifyToken, verifyAdmin, getAllPayments);
router.get("/unpaid", verifyToken, verifyAdmin, getUnpaidUsers);

module.exports = router;
