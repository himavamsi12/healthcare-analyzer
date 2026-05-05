const express = require("express");
const router = express.Router();
const { INSTAMART_ORDERS } = require("../mock/restaurants");
const { generateRestockSuggestions } = require("../services/claudeFilter");

// Get past Instamart orders
router.get("/orders", (req, res) => {
  res.json({ orders: INSTAMART_ORDERS });
});

// Generate weekly restock suggestions (rule-based)
router.post("/restock", (req, res) => {
  const { patientProfile } = req.body;
  if (!patientProfile || !patientProfile.condition) {
    return res.status(400).json({ error: "patientProfile with condition is required" });
  }

  const suggestions = generateRestockSuggestions(INSTAMART_ORDERS, patientProfile);
  res.json({ suggestions });
});

// Approve and checkout restock cart (mock)
router.post("/checkout", (req, res) => {
  const { items } = req.body;
  const total = items.reduce(
    (sum, item) => sum + (item.estimatedPrice || 0),
    0
  );
  const orderId = `IM_${Date.now()}`;

  res.json({
    success: true,
    orderId,
    items,
    total,
    estimatedDelivery: "10-15 min",
    message: "Instamart order placed! (Demo mode)",
  });
});

module.exports = router;
