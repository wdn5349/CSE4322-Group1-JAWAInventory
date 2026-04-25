const db = require("../database");

const getAllEmployees = (callback) => {
  db.all(`SELECT * FROM employees ORDER BY name ASC`, [], callback);
};

const getEmployeeByUsername = (username, callback) => {
  db.get(`SELECT * FROM employees WHERE username = ?`, [username], callback);
};

const addEmployee = ({ username, email, password }, callback) => {
  db.run(
    `INSERT INTO employees (username, email, password) VALUES (?, ?, ?)`,
    [username, email, password],
    callback,
  );
};

const updateEmployee = (id, { name, role, email }, callback) => {
  db.run(
    `UPDATE employees SET name=?, role=?, email=? WHERE id=?`,
    [name, role, email, id],
    callback,
  );
};

const deleteEmployee = (id, callback) => {
  db.run(`DELETE FROM employees WHERE id = ?`, [id], callback);
};

module.exports = {
  getAllEmployees,
  getEmployeeByUsername,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
