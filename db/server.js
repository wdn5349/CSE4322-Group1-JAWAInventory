const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

// Helper to build an HTML table from query results
function buildTable(title, rows) {
  let html = `<h2>${title}</h2>`;

  if (!rows || rows.length === 0) {
    html += "<p>No data found.</p>";
    return html;
  }

  const columns = Object.keys(rows[0]);

  html += "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; margin-bottom: 30px;'>";
  html += "<tr>";
  for (const col of columns) {
    html += `<th>${col}</th>`;
  }
  html += "</tr>";

  for (const row of rows) {
    html += "<tr>";
    for (const col of columns) {
      html += `<td>${row[col] ?? ""}</td>`;
    }
    html += "</tr>";
  }

  html += "</table>";
  return html;
}

app.get("/", (req, res) => {
  const queries = {
    categories: "SELECT * FROM categories",
    products: `
      SELECT products.id, products.name, products.sku, categories.name AS category,
             products.quantity, products.price
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
    `,
    customers: "SELECT * FROM customers",
    employees: "SELECT * FROM employees",
    orders: `
      SELECT orders.id, orders.order_number, customers.name AS customer,
             employees.name AS employee, orders.order_date, orders.status
      FROM orders
      LEFT JOIN customers ON orders.customer_id = customers.id
      LEFT JOIN employees ON orders.employee_id = employees.id
    `,
    order_items: `
      SELECT order_items.id, orders.order_number, products.name AS product,
             order_items.quantity, order_items.unit_price
      FROM order_items
      LEFT JOIN orders ON order_items.order_id = orders.id
      LEFT JOIN products ON order_items.product_id = products.id
    `
  };

  const results = {};
  const keys = Object.keys(queries);
  let completed = 0;

  keys.forEach((key) => {
    db.all(queries[key], [], (err, rows) => {
      if (err) {
        results[key] = `<h2>${key}</h2><p style="color:red;">Error: ${err.message}</p>`;
      } else {
        results[key] = buildTable(key.charAt(0).toUpperCase() + key.slice(1), rows);
      }

      completed++;

      if (completed === keys.length) {
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Inventory Database Viewer</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 40px;
                background: #f4f4f4;
              }
              h1 {
                color: #333;
              }
              h2 {
                margin-top: 40px;
                color: #222;
              }
              table {
                width: 100%;
                background: white;
              }
              th {
                background: #ddd;
              }
              th, td {
                text-align: left;
              }
            </style>
          </head>
          <body>
            <h1>Inventory Database Contents</h1>
            ${results.categories}
            ${results.products}
            ${results.customers}
            ${results.employees}
            ${results.orders}
            ${results.order_items}
          </body>
          </html>
        `);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Website running at http://localhost:${PORT}`);
});