const db = require("../database");

const getAllProducts = (sortBy, callback) => {
  const sort =
    sortBy === "quantity" ? "p.quantity ASC" : "c.name ASC, p.name ASC";
  db.all(
    `
        SELECT p.id, p.name, p.description, p.sku, p.category_id,
               c.name AS category, p.quantity, p.price, p.unit, p.date_added
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY ${sort}
    `,
    [],
    callback,
  );
};

const getProductById = (id, callback) => {
  db.get(`SELECT * FROM products WHERE id = ?`, [id], callback);
};

const addProduct = ({ name, description, sku, category_id, quantity, price, unit }, callback) => {
  db.run(
    `INSERT INTO products (name, description, sku, category_id, quantity, price, unit) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description ?? null, sku ?? null, category_id ?? null, quantity, price, unit ?? "each"],
    callback,
  );
};

const updateProduct = (
  id,
  { name, description, sku, category_id, quantity, price, unit },
  callback,
) => {
  db.run(
    `UPDATE products SET name=?, description=?, sku=?, category_id=?, quantity=?, price=?, unit=? WHERE id=?`,
    [name, description ?? null, sku ?? null, category_id ?? null, quantity, price, unit ?? "each", id],
    callback,
  );
};

const adjustQuantity = (id, adjustment, callback) => {
  db.run(
    `UPDATE products SET quantity = quantity + ? WHERE id = ?`,
    [adjustment, id],
    callback,
  );
};

const deleteProduct = (id, callback) => {
  db.run(`DELETE FROM products WHERE id = ?`, [id], callback);
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  adjustQuantity,
  deleteProduct,
};
