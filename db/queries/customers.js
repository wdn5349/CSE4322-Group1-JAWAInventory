const db = require("../database");

const getAllCustomers = (callback) => {
  db.all(`SELECT * FROM customers ORDER BY name ASC`, [], callback);
};

const getCustomerById = (id, callback) => {
  db.get(`SELECT * FROM customers WHERE id = ?`, [id], callback);
};

const addCustomer = ({ name, email, phone }, callback) => {
  db.run(
    `INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)`,
    [name, email, phone],
    callback,
  );
};

const updateCustomer = (id, { name, email, phone }, callback) => {
  db.run(
    `UPDATE customers SET name=?, email=?, phone=? WHERE id=?`,
    [name, email, phone, id],
    callback,
  );
};

const deleteCustomer = (id, callback) => {
  db.run(`DELETE FROM customers WHERE id = ?`, [id], callback);
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
