const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  searchRestaurants: (q) =>
    request(`/food/restaurants${q ? `?q=${encodeURIComponent(q)}` : ""}`),

  getMenu: (restaurantId) =>
    request(`/food/restaurants/${restaurantId}/menu`),

  filterMenu: (restaurantId, patientProfile) =>
    request(`/food/restaurants/${restaurantId}/filter`, {
      method: "POST",
      body: JSON.stringify({ patientProfile }),
    }),

  placeOrder: (restaurantId, items) =>
    request("/food/order", {
      method: "POST",
      body: JSON.stringify({ restaurantId, items }),
    }),

  getInstamartOrders: () => request("/instamart/orders"),

  getRestockSuggestions: (patientProfile) =>
    request("/instamart/restock", {
      method: "POST",
      body: JSON.stringify({ patientProfile }),
    }),

  checkoutInstamart: (items) =>
    request("/instamart/checkout", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
};
