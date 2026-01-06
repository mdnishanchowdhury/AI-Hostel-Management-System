const SSLCommerzPayment = require("sslcommerz-lts");
const axios = require("axios");
const paymentsCollection = require("../models/paymentModel");
require("dotenv").config();
const usersCollection = require("../models/userModel");
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASS;
const is_live = process.env.IS_LIVE === "true";

// Validate payment with SSLCommerz
const validatePayment = async (val_id) => {
  const url = is_live
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

  const response = await axios.get(url, {
    params: { val_id, store_id, store_passwd, format: "json" },
  });
  return response.data;
};

const initPayment = async (req, res) => {
  const { email,total, userName, studentId, month, roomRent, mealCost } = req.body;

  if (!total || !email || !userName || !studentId || !month) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const tran_id = `HOSTEL_${month}_${Date.now()}`;

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

    if (!apiResponse?.GatewayPageURL) {
      return res.status(400).json({ message: "SSL payment initiation failed" });
    }

    // save payments
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
      createdAt: new Date(),
    });

    res.status(200).json({ url: apiResponse.GatewayPageURL });
  } catch (err) {
    console.error("Init Payment Error:", err);
    res.status(500).json({ message: "Payment init error" });
  }
};

//payment success
const handleSuccess = async (req, res) => {
  try {
    const tran_id = req.body.tran_id || req.query.tran_id;
    const val_id = req.body.val_id || req.query.val_id;
    if (!tran_id || !val_id) {
      return res.redirect(`${process.env.CLIENT_URL}/payment-fail`);
    }

    const validation = await validatePayment(val_id);

    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      await paymentsCollection.updateOne(
        { tran_id },
        {
          $set: {
            status: "Paid",
            paidAt: new Date(),
            val_id,
            bank_tran_id: validation.bank_tran_id,
            card_type: validation.card_type,
          },
        }
      );
      return res.redirect(`${process.env.CLIENT_URL}/dashboard/payments?payment=success`);
    }

    res.redirect(`${process.env.CLIENT_URL}/payment-fail`);
  } catch (err) {
    console.error("Handle Success Error:", err);
    res.redirect(`${process.env.CLIENT_URL}/payment-fail`);
  }
};

//payment fail
const handleFail = async (req, res) => {
  const tran_id = req.body.tran_id || req.query.tran_id;
  if (tran_id) {
    await paymentsCollection.updateOne({ tran_id }, { $set: { status: "Failed" } });
  }
  res.redirect(`${process.env.CLIENT_URL}/payment-fail`);
};

// payment cancel
const handleCancel = async (req, res) => {
  const tran_id = req.body.tran_id || req.query.tran_id;
  if (tran_id) {
    await paymentsCollection.updateOne({ tran_id }, { $set: { status: "Cancelled" } });
  }
  res.redirect(`${process.env.CLIENT_URL}/payment-cancel`);
};

// IPN
const handleIPN = async (req, res) => {
  const { tran_id, val_id } = req.body;

  if (!tran_id || !val_id) return res.status(400).send("Invalid IPN");

  try {
    const validation = await validatePayment(val_id);
    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      await paymentsCollection.updateOne(
        { tran_id },
        { $set: { status: "Paid", paidAt: new Date() } }
      );
    }
    res.status(200).send("IPN OK");
  } catch (err) {
    console.error("IPN Error:", err);
    res.status(500).send("IPN Error");
  }
};

// get payments
const getPaymentsByEmail = async (req, res) => {
  try {
    const { email } = req.query; 

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const payments = await paymentsCollection
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(payments);
  } catch (error) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ message: "Failed to get payments" });
  }
};

const getUnpaidUsers = async (req, res) => {
  try {
    const { month } = req.query;

    const paid = await paymentsCollection
      .find(month ? { month, status: "Paid" } : { status: "Paid" })
      .project({ email: 1 })
      .toArray();

    const paidEmails = paid.map(p => p.email);

    const unpaidUsers = await usersCollection.find({
      role: "user",
      email: { $nin: paidEmails }
    }).toArray();

    res.send({ unpaidUsers });
  } catch (err) {
    res.status(500).send({ message: "Failed to get unpaid users" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { month } = req.query;

    const query = { status: "Paid" };
    if (month) query.month = month;

    const payments = await paymentsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.send(payments);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to get payments" });
  }
};

module.exports = {getPaymentsByEmail,handleIPN ,handleCancel,handleFail,handleSuccess,initPayment,getAllPayments ,getUnpaidUsers };

