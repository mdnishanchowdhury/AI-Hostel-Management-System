const SSLCommerzPayment = require("sslcommerz-lts");
const paymentsCollection = require("../models/paymentModel"); // MongoDB collection
require("dotenv").config();

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASS;
const is_live = process.env.IS_LIVE === "true";

// Initialize Online Payment
exports.initPayment = async (req, res) => {
  const { total, email, userName, studentId, month, roomRent, mealCost } = req.body;

  if (!total || !email || !userName || !studentId || !month)
    return res.status(400).json({ message: "Missing required fields" });

  const tran_id = `txn_${Date.now()}`;
  const data = {
    total_amount: total,
    currency: "BDT",
    tran_id,
    success_url: `${process.env.BASE_URL}/payments/success`,
    fail_url: `${process.env.BASE_URL}/payments/fail`,
    cancel_url: `${process.env.BASE_URL}/payments/cancel`,
    ipn_url: `${process.env.BASE_URL}/payments/ipn`,
    shipping_method: "NO",
    product_name: "Hostel Fee",
    product_category: "Service",
    product_profile: "general",
    cus_name: userName,
    cus_email: email,
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      await paymentsCollection.insertOne({
        email,
        userName,
        studentId,
        month,
        roomRent,
        mealCost,
        amount: total,
        method: "Online",
        status: "Pending",
        tran_id,
        date: new Date(),
      });

      return res.status(200).json({ url: apiResponse.GatewayPageURL });
    } else {
      return res.status(400).json({ message: "SSLCommerz initialization failed" });
    }
  } catch (error) {
    console.error("SSLCommerz init error:", error);
    return res.status(500).json({ message: "Payment initialization error" });
  }
};

// Payment Success
exports.handleSuccess = async (req, res) => {
  try {
    const tran_id = req.body.tran_id || req.query.tran_id;
    if (!tran_id) return res.redirect(`${process.env.CLIENT_URL}/payment-fail`);

    await paymentsCollection.updateOne({ tran_id }, { $set: { status: "Paid" } });
    res.redirect(`${process.env.CLIENT_URL}/payment-success`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.CLIENT_URL}/payment-fail`);
  }
};

// Payment Fail
exports.handleFail = async (req, res) => {
  try {
    const tran_id = req.body.tran_id || req.query.tran_id;
    if (tran_id) await paymentsCollection.updateOne({ tran_id }, { $set: { status: "Failed" } });
    res.redirect(`${process.env.CLIENT_URL}/payment-fail`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.CLIENT_URL}/payment-fail`);
  }
};

// Payment Cancel
exports.handleCancel = async (req, res) => {
  try {
    const tran_id = req.body.tran_id || req.query.tran_id;
    if (tran_id) await paymentsCollection.updateOne({ tran_id }, { $set: { status: "Cancelled" } });
    res.redirect(`${process.env.CLIENT_URL}/payment-cancel`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.CLIENT_URL}/payment-cancel`);
  }
};

// IPN (optional)
exports.handleIPN = async (req, res) => {
  console.log("IPN Received:", req.body);
  res.status(200).send("IPN OK");
};

// Get Payments by Email
exports.getPaymentsByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email required" });

    const payments = await paymentsCollection.find({ email }).sort({ date: -1 }).toArray();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user payments" });
  }
};

// Get All Payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentsCollection.find().sort({ date: -1 }).toArray();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
