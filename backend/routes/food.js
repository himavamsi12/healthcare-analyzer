const express = require("express");
const router = express.Router();
const { RESTAURANTS, MENUS } = require("../mock/restaurants");
const { filterMenuWithClaude } = require("../services/claudeFilter");

// Search restaurants
router.get("/restaurants", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ restaurants: RESTAURANTS });

  const filtered = RESTAURANTS.filter(
    (r) =>
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(q.toLowerCase())
  );
  res.json({ restaurants: filtered });
});

// Get menu for a restaurant
router.get("/restaurants/:id/menu", (req, res) => {
  const menu = MENUS[req.params.id];
  if (!menu) return res.status(404).json({ error: "Restaurant not found" });
  res.json({ menu });
});

// Filter menu with rule-based classifier
router.post("/restaurants/:id/filter", (req, res) => {
  const menu = MENUS[req.params.id];
  if (!menu) return res.status(404).json({ error: "Restaurant not found" });

  const { patientProfile } = req.body;
  if (!patientProfile || !patientProfile.condition) {
    return res.status(400).json({ error: "patientProfile with condition is required" });
  }

  const filteredMenu = filterMenuWithClaude(menu, patientProfile);
  res.json({ filteredMenu });
});

// Place food order (mock)
router.post("/order", (req, res) => {
  const { items, restaurantId } = req.body;
  const restaurant = RESTAURANTS.find((r) => r.id === restaurantId);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = `ORDER_${Date.now()}`;

  res.json({
    success: true,
    orderId,
    restaurant: restaurant?.name,
    items,
    total,
    estimatedDelivery: "35-45 min",
    message: "Order placed successfully! (Demo mode)",
  });
});

module.exports = router;
