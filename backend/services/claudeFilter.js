const DIETARY_RULES = {
  diabetes: {
    unsafe: [
      "refined sugar", "white rice", "maida", "deep fried", "high GI",
      "fruit juice", "sweets", "desserts", "sugar syrup", "candy", "chocolate",
      "bread pudding", "gulab jamun", "meetha", "custard with sugar",
    ],
    caution: [
      "wheat roti", "banana", "potato", "full fat dairy", "tandoori roti",
      "paneer", "butter", "cream", "whole wheat",
    ],
    safe: [
      "grilled protein", "dal", "vegetables", "brown rice", "eggs",
      "chicken breast", "fish", "lentils", "cabbage", "beans",
    ],
  },
  kidney: {
    unsafe: [
      "banana", "orange", "potato", "dairy", "nuts", "cola", "high sodium",
      "pickles", "processed food", "phosphorus", "potassium",
      "full fat dairy", "cheese", "milk",
    ],
    caution: [
      "tomato", "spinach", "whole wheat", "paneer", "raita", "yogurt",
    ],
    safe: [
      "white rice", "cabbage", "beans", "apple", "low sodium",
      "eggs", "chicken (small portions)",
    ],
  },
  hypertension: {
    unsafe: [
      "high sodium", "pickles", "papad", "processed", "saturated fat",
      "red meat", "alcohol", "salty", "sodium",
    ],
    caution: [
      "full fat dairy", "egg yolk", "shellfish", "butter", "cream",
      "paneer", "raita",
    ],
    safe: [
      "fruits", "vegetables", "grilled food", "low sodium",
      "dal", "brown rice", "chicken breast",
    ],
  },
};

// Keyword-based diet rules per item name + description
const ITEM_RULES = {
  diabetes: {
    unsafe: {
      keywords: ["gulab jamun", "sugar syrup", "meetha", "bread pudding", "custard", "fruit juice", "deep fried", "chicken 65", "dessert"],
      reason: (item) => {
        if (/gulab jamun|meetha|bread pudding/i.test(item.name + item.description)) return "Contains refined sugar and high-GI ingredients — causes rapid blood sugar spikes.";
        if (/custard/i.test(item.name + item.description)) return "High sugar content in custard raises blood glucose levels rapidly.";
        if (/fruit juice/i.test(item.name + item.description)) return "Fruit juice is high-GI with concentrated sugar — avoid for diabetes.";
        if (/chicken 65|deep fry/i.test(item.name + item.description)) return "Deep fried coating raises glycemic load and adds unhealthy fats.";
        return "High sugar or high-GI content unsuitable for diabetes management.";
      },
    },
    caution: {
      keywords: ["biryani", "raita", "paneer butter", "tandoori roti", "roti", "potato", "banana"],
      reason: (item) => {
        if (/biryani/i.test(item.name)) return "Biryani uses white rice which has a high glycemic index — eat in small portions.";
        if (/raita/i.test(item.name)) return "Full-fat yogurt has moderate carbs; small portions are acceptable.";
        if (/paneer butter masala/i.test(item.name)) return "Rich butter-cream gravy adds saturated fat; moderate portion advised.";
        if (/tandoori roti|roti/i.test(item.name)) return "Whole wheat roti is moderate GI — limit to 1-2 pieces per meal.";
        return "Moderate glycemic impact — consume in controlled portions.";
      },
    },
    safe: {
      reason: (item) => {
        if (/grilled chicken/i.test(item.name)) return "Lean grilled protein with no added sugar — excellent for blood sugar control.";
        if (/dal tadka/i.test(item.name)) return "Lentils are low-GI, high-fiber protein — ideal for diabetes management.";
        if (/brown rice/i.test(item.name)) return "Whole grain with lower GI than white rice — good controlled carb choice.";
        if (/chicken kebab/i.test(item.name)) return "Grilled minced chicken is lean protein with no high-GI ingredients.";
        if (/egg|boiled egg/i.test(item.name)) return "Eggs are protein-rich with negligible carbs — safe for diabetes.";
        if (/cabbage/i.test(item.name)) return "Low-carb vegetable with high fiber — excellent for blood sugar stability.";
        if (/mixed vegetable/i.test(item.name)) return "Non-starchy vegetables are low-GI and support blood sugar control.";
        return "Low glycemic impact — suitable for diabetes management.";
      },
    },
  },
  kidney: {
    unsafe: {
      keywords: ["banana", "orange", "haleem", "paneer butter", "raita", "double ka meetha", "pista house biryani", "fruit juice"],
      reason: (item) => {
        if (/haleem/i.test(item.name)) return "Haleem is very high in protein and phosphorus — harmful for CKD kidneys.";
        if (/paneer butter masala/i.test(item.name)) return "Dairy-heavy dish — high phosphorus load is dangerous for CKD patients.";
        if (/double ka meetha/i.test(item.name)) return "Bread and dairy-based dessert — very high phosphorus and potassium.";
        if (/biryani/i.test(item.name) && /pista/i.test(item.name)) return "High-protein biryani with spice blend — excess protein strains CKD kidneys.";
        if (/fruit juice/i.test(item.name)) return "High potassium from concentrated fruit — dangerous for CKD potassium levels.";
        return "High phosphorus, potassium, or protein content — unsafe for CKD.";
      },
    },
    caution: {
      keywords: ["raita", "dal tadka", "chicken 65", "mutton", "egg curry", "paneer"],
      reason: (item) => {
        if (/raita/i.test(item.name)) return "Yogurt contains phosphorus — limit portion size for CKD patients.";
        if (/dal tadka/i.test(item.name)) return "Lentils have moderate potassium — small portions acceptable in CKD.";
        if (/chicken 65/i.test(item.name)) return "High protein and sodium from marinade — limit portion for CKD.";
        if (/mutton/i.test(item.name)) return "Red meat is high in phosphorus and protein — small portion only.";
        if (/egg curry/i.test(item.name)) return "Eggs have moderate phosphorus — 1 egg per meal is acceptable in CKD.";
        return "Moderate kidney load — consume in small, controlled portions.";
      },
    },
    safe: {
      reason: (item) => {
        if (/veg biryani/i.test(item.name)) return "White rice is low-potassium and easy on kidneys — suitable for CKD.";
        if (/cabbage/i.test(item.name)) return "Low potassium, low phosphorus vegetable — one of the best choices for CKD.";
        if (/brown rice/i.test(item.name)) return "Good energy source with low phosphorus — kidney-friendly carbohydrate.";
        if (/grilled chicken/i.test(item.name)) return "Lean protein in small portion — acceptable within CKD protein limits.";
        if (/boiled egg|apple/i.test(item.name)) return "Low potassium option — safe for CKD in controlled quantities.";
        if (/mixed vegetable/i.test(item.name)) return "Non-leafy mixed vegetables are generally low in potassium for CKD.";
        if (/tandoori roti/i.test(item.name)) return "Low sodium flatbread — acceptable as a carbohydrate source in CKD.";
        return "Low potassium and phosphorus — generally safe for CKD management.";
      },
    },
  },
  hypertension: {
    unsafe: {
      keywords: ["chicken 65", "haleem", "double ka meetha", "mutton biryani"],
      reason: (item) => {
        if (/chicken 65/i.test(item.name)) return "Deep fried with high sodium marinade — significantly raises blood pressure.";
        if (/haleem/i.test(item.name)) return "Slow-cooked with high salt content — excessive sodium for hypertension.";
        if (/double ka meetha/i.test(item.name)) return "Sugary, fatty dessert — raises blood pressure via saturated fat and sugar load.";
        if (/mutton biryani/i.test(item.name)) return "Red meat with high sodium spice blend — avoid for hypertension control.";
        return "High sodium or saturated fat content — unsafe for hypertension.";
      },
    },
    caution: {
      keywords: ["raita", "paneer butter masala", "chicken biryani", "pista house biryani", "hyderabadi biryani", "special haleem"],
      reason: (item) => {
        if (/raita/i.test(item.name)) return "Full-fat yogurt has saturated fat — small portion acceptable for hypertension.";
        if (/paneer butter masala/i.test(item.name)) return "Butter and cream are high in saturated fat — limit portion size.";
        if (/biryani/i.test(item.name)) return "Biryani spice blends contain significant sodium — eat in small portions.";
        return "Moderate sodium or fat content — consume in controlled portions.";
      },
    },
    safe: {
      reason: (item) => {
        if (/grilled chicken/i.test(item.name)) return "Low sodium grilled protein — ideal for blood pressure management.";
        if (/dal tadka/i.test(item.name)) return "High-fiber lentils support blood pressure reduction naturally.";
        if (/brown rice/i.test(item.name)) return "Whole grain with potassium and magnesium — supports healthy blood pressure.";
        if (/cabbage/i.test(item.name)) return "Low-sodium vegetable rich in potassium — actively helps lower blood pressure.";
        if (/veg biryani/i.test(item.name)) return "Vegetable-based with moderate sodium — acceptable with small portion.";
        if (/mixed vegetable/i.test(item.name)) return "Fresh vegetables are naturally low-sodium and support blood pressure control.";
        if (/tandoori roti/i.test(item.name)) return "Low-fat whole wheat bread baked without added salt — suitable for hypertension.";
        if (/egg|boiled egg/i.test(item.name)) return "Boiled egg without yolk excess is a lean, low-sodium protein option.";
        if (/chicken kebab/i.test(item.name)) return "Grilled kebab with minimal added salt — good lean protein for hypertension.";
        if (/apple custard/i.test(item.name)) return "Apple is potassium-rich and supports blood pressure; custard in small amounts is fine.";
        return "Low sodium and low saturated fat — suitable for hypertension management.";
      },
    },
  },
};

function classifyItem(item, condition) {
  const rules = ITEM_RULES[condition] || ITEM_RULES.diabetes;
  const haystack = (item.name + " " + item.description).toLowerCase();

  // Check unsafe first
  for (const keyword of rules.unsafe.keywords) {
    if (haystack.includes(keyword.toLowerCase())) {
      return { status: "unsafe", reason: rules.unsafe.reason(item) };
    }
  }
  // Then caution
  for (const keyword of rules.caution.keywords) {
    if (haystack.includes(keyword.toLowerCase())) {
      return { status: "caution", reason: rules.caution.reason(item) };
    }
  }
  // Default to safe
  return { status: "safe", reason: rules.safe.reason(item) };
}

function filterMenuWithClaude(menuItems, patientProfile) {
  const { condition } = patientProfile;
  return menuItems.map((item) => {
    const { status, reason } = classifyItem(item, condition);
    return { ...item, status, reason };
  });
}

const RESTOCK_SUGGESTIONS = {
  diabetes: [
    { name: "Brown Rice (5kg)", category: "Grains", quantity: "1 bag", reason: "Low-GI whole grain — keeps blood sugar stable throughout the day.", status: "approved", estimatedPrice: 350 },
    { name: "Toor Dal (1kg)", category: "Lentils", quantity: "2 packs", reason: "High-fiber lentil protein slows glucose absorption — ideal for diabetes.", status: "approved", estimatedPrice: 160 },
    { name: "Cabbage (1 head)", category: "Vegetables", quantity: "2 heads", reason: "Very low-carb, high-fiber vegetable — no impact on blood sugar.", status: "approved", estimatedPrice: 40 },
    { name: "Chicken Breast (500g)", category: "Protein", quantity: "2 packs", reason: "Lean protein with zero carbs — essential for balanced diabetic meals.", status: "approved", estimatedPrice: 180 },
    { name: "Eggs (12 pcs)", category: "Protein", quantity: "1 tray", reason: "Low-carb protein source with healthy fats — safe for diabetes.", status: "approved", estimatedPrice: 90 },
    { name: "Apple (6 pcs)", category: "Fruits", quantity: "6 pieces", reason: "Low-GI fruit with fiber — a safe sweet option for diabetes.", status: "approved", estimatedPrice: 120 },
    { name: "Moong Dal (500g)", category: "Lentils", quantity: "1 pack", reason: "Easily digestible, low-GI lentil — frequently ordered and diabetes-safe.", status: "approved", estimatedPrice: 90 },
    { name: "Olive Oil (500ml)", category: "Oils", quantity: "1 bottle", reason: "Monounsaturated fats improve insulin sensitivity over time.", status: "approved", estimatedPrice: 380 },
  ],
  kidney: [
    { name: "White Rice (5kg)", category: "Grains", quantity: "1 bag", reason: "Low potassium, low phosphorus carb — the recommended staple for CKD.", status: "approved", estimatedPrice: 280 },
    { name: "Cabbage (1 head)", category: "Vegetables", quantity: "2 heads", reason: "Exceptionally low in potassium and phosphorus — top CKD-safe vegetable.", status: "approved", estimatedPrice: 40 },
    { name: "Beans (500g)", category: "Vegetables", quantity: "2 packs", reason: "Low potassium green vegetable — safe and filling for CKD patients.", status: "approved", estimatedPrice: 55 },
    { name: "Apple (6 pcs)", category: "Fruits", quantity: "6 pieces", reason: "Low potassium fruit — one of the few fruits safe for CKD.", status: "approved", estimatedPrice: 120 },
    { name: "Low Sodium Salt", category: "Condiments", quantity: "1 pack", reason: "Reduces sodium intake critical for protecting remaining kidney function.", status: "approved", estimatedPrice: 45 },
    { name: "Chicken Breast (500g)", category: "Protein", quantity: "1 pack", reason: "Controlled lean protein — CKD requires protein but not in excess.", status: "approved", estimatedPrice: 180 },
    { name: "Olive Oil (500ml)", category: "Oils", quantity: "1 bottle", reason: "Heart-healthy fat with no potassium or phosphorus load.", status: "approved", estimatedPrice: 380 },
  ],
  hypertension: [
    { name: "Brown Rice (5kg)", category: "Grains", quantity: "1 bag", reason: "Whole grain with magnesium and potassium that supports blood pressure control.", status: "approved", estimatedPrice: 350 },
    { name: "Toor Dal (1kg)", category: "Lentils", quantity: "2 packs", reason: "High potassium and fiber lentils actively help reduce blood pressure.", status: "approved", estimatedPrice: 160 },
    { name: "Cabbage (1 head)", category: "Vegetables", quantity: "2 heads", reason: "Naturally low-sodium vegetable — ideal for a blood pressure-friendly diet.", status: "approved", estimatedPrice: 40 },
    { name: "Banana (6 pcs)", category: "Fruits", quantity: "6 pieces", reason: "High potassium fruit counteracts sodium and helps lower blood pressure.", status: "approved", estimatedPrice: 60 },
    { name: "Chicken Breast (500g)", category: "Protein", quantity: "2 packs", reason: "Lean low-sodium protein — avoids saturated fat that raises blood pressure.", status: "approved", estimatedPrice: 180 },
    { name: "Low Sodium Salt", category: "Condiments", quantity: "1 pack", reason: "Reducing sodium is the single most effective dietary change for hypertension.", status: "approved", estimatedPrice: 45 },
    { name: "Olive Oil (500ml)", category: "Oils", quantity: "1 bottle", reason: "Lowers LDL cholesterol and supports healthy blood pressure.", status: "approved", estimatedPrice: 380 },
    { name: "Oats (1kg)", category: "Grains", quantity: "1 pack", reason: "Beta-glucan fiber in oats is clinically proven to reduce blood pressure.", status: "approved", estimatedPrice: 150 },
  ],
};

function generateRestockSuggestions(orderHistory, patientProfile) {
  const { condition } = patientProfile;
  const suggestions = RESTOCK_SUGGESTIONS[condition] || RESTOCK_SUGGESTIONS.diabetes;
  return suggestions;
}

module.exports = { filterMenuWithClaude, generateRestockSuggestions };
