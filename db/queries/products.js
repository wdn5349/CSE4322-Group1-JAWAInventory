const db = require("../database");

const getAllProducts = (sortBy, callback) => {
  const sort =
    sortBy === "quantity" ? "p.quantity ASC" : "c.name ASC, p.name ASC";
  db.all(
    `
        SELECT p.id, p.name, p.sku, p.quantity, p.price, c.name AS category
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

const addProduct = ({ name, sku, category_id, quantity, price }, callback) => {
  db.run(
    `INSERT INTO products (name, sku, category_id, quantity, price) VALUES (?, ?, ?, ?, ?)`,
    [name, sku, category_id, quantity, price],
    callback,
  );
};

const updateProduct = (
  id,
  { name, sku, category_id, quantity, price },
  callback,
) => {
  db.run(
    `UPDATE products SET name=?, sku=?, category_id=?, quantity=?, price=? WHERE id=?`,
    [name, sku, category_id, quantity, price, id],
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
