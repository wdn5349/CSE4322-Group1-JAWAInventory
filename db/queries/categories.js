const db = require("../database");

const getAllCategories = (callback) => {
  db.all(`SELECT * FROM categories ORDER BY name ASC`, [], callback);
};

const getCategoryById = (id, callback) => {
  db.get(`SELECT * FROM categories WHERE id = ?`, [id], callback);
};

const addCategory = ({ name, description }, callback) => {
  db.run(
    `INSERT INTO categories (name, description) VALUES (?, ?)`,
    [name, description],
    callback,
  );
};

const updateCategory = (id, { name, description }, callback) => {
  db.run(
    `UPDATE categories SET name=?, description=? WHERE id=?`,
    [name, description, id],
    callback,
  );
};

const deleteCategory = (id, callback) => {
  db.run(`DELETE FROM categories WHERE id = ?`, [id], callback);
};

const findOrCreateCategory = (name, callback) => {
  db.get(
    `SELECT * FROM categories WHERE LOWER(name) = LOWER(?)`,
    [name],
    (err, row) => {
      if (err) return callback(err);
      if (row) return callback(null, row);
      db.run(
        `INSERT INTO categories (name) VALUES (?)`,
        [name],
        function (err2) {
          if (err2) return callback(err2);
          callback(null, { id: this.lastID, name });
        }
      );
    }
  );
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
  findOrCreateCategory,
};
