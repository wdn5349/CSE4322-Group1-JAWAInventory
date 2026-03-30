const db = require("../database");

const getAllEmployees = (callback) => {
  db.all(`SELECT * FROM employees ORDER BY name ASC`, [], callback);
};

const getEmployeeById = (id, callback) => {
  db.get(`SELECT * FROM employees WHERE id = ?`, [id], callback);
};

const addEmployee = ({ name, role, email }, callback) => {
  db.run(
    `INSERT INTO employees (name, role, email) VALUES (?, ?, ?)`,
    [name, role, email],
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
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
