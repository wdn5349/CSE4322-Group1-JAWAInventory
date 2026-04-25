const express = require("express");
const path = require("path");
const db = require("./database");

const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./queries/products");
const { getAllCategories, findOrCreateCategory } = require("./queries/categories");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Products
app.get("/api/products", (req, res) => {
  getAllProducts(null, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/products", (req, res) => {
  addProduct(req.body, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.put("/api/products/:id", (req, res) => {
  updateProduct(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete("/api/products/:id", (req, res) => {
  deleteProduct(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Categories
app.get("/api/categories", (req, res) => {
  getAllCategories((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/categories", (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "Name is required." });
  findOrCreateCategory(name, (err, category) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(category);
  });
});

app.listen(PORT, () => {
  console.log(`Website running at http://localhost:${PORT}`);
});
