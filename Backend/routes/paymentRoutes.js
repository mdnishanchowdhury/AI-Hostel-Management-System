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
} = require("../controllers/paymentController");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// Payment Init
router.post("/init", verifyToken, initPayment);

// SSLCommerz Responses
router.post("/success", handleSuccess);
router.get("/success", handleSuccess);
router.post("/fail", handleFail);
router.get("/fail", handleFail);
router.post("/cancel", handleCancel);
router.get("/cancel", handleCancel);
router.post("/ipn", handleIPN);

// Get Payments
router.get("/user", verifyToken, getPaymentsByEmail);
router.get("/", verifyToken, verifyAdmin, getAllPayments);

module.exports = router;
