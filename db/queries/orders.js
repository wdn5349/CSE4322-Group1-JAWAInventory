const db = require("../database");

const getAllOrders = (callback) => {
  db.all(
    `
        SELECT o.id, o.order_number, o.order_date, o.status,
               c.name AS customer, e.name AS employee
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN employees e ON o.employee_id = e.id
        ORDER BY o.order_date DESC, o.id DESC
    `,
    [],
    callback,
  );
};

const getOrderById = (id, callback) => {
  db.get(
    `
        SELECT o.id, o.order_number, o.order_date, o.status,
               o.customer_id, o.employee_id,
               c.name AS customer, e.name AS employee
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN employees e ON o.employee_id = e.id
        WHERE o.id = ?
    `,
    [id],
    callback,
  );
};

const addOrder = (
  { order_number, customer_id, employee_id, order_date, status },
  callback,
) => {
  db.run(
    `INSERT INTO orders (order_number, customer_id, employee_id, order_date, status)
     VALUES (?, ?, ?, ?, ?)`,
    [order_number, customer_id, employee_id, order_date, status],
    callback,
  );
};

const updateOrderStatus = (id, status, callback) => {
  db.run(`UPDATE orders SET status=? WHERE id=?`, [status, id], callback);
};

const deleteOrderWithItems = (id, callback) => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    db.run(`DELETE FROM order_items WHERE order_id = ?`, [id], (err) => {
      if (err) {
        db.run("ROLLBACK");
        return callback(err);
      }
      db.run(`DELETE FROM orders WHERE id = ?`, [id], (err) => {
        if (err) {
          db.run("ROLLBACK");
          return callback(err);
        }
        db.run("COMMIT", callback);
      });
    });
  });
};

const getOrderItems = (order_id, callback) => {
  db.all(
    `
        SELECT oi.id, oi.quantity, oi.unit_price,
               p.name AS product, p.sku
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `,
    [order_id],
    callback,
  );
};

const addOrderItem = (
  { order_id, product_id, quantity, unit_price },
  callback,
) => {
  db.run(
    `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
    [order_id, product_id, quantity, unit_price],
    callback,
  );
};

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrderStatus,
  deleteOrderWithItems,
  getOrderItems,
  addOrderItem,
};
