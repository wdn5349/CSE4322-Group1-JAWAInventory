
-- ── Categories ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,   -- category names must be unique
    description TEXT                       -- optional longer description
);

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    description TEXT,
    sku         TEXT    UNIQUE,
    category_id INTEGER REFERENCES categories(id),
    quantity    INTEGER NOT NULL DEFAULT 0,
    price       REAL    NOT NULL DEFAULT 0.0,
    unit        TEXT    NOT NULL DEFAULT 'each',
    date_added  TEXT    NOT NULL DEFAULT (date('now'))
);

-- ── Customers ─────────────────────────────────────────────────────────────────
-- People who purchase from the inventory.
CREATE TABLE IF NOT EXISTS customers (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT UNIQUE,                     -- optional
    phone TEXT
);

-- ── Employees ─────────────────────────────────────────────────────────────────
-- Staff members who process sales.
CREATE TABLE IF NOT EXISTS employees (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT NOT NULL,                      
    email TEXT UNIQUE,
    password TEXT NOT NULL
);

-- ── Orders ────────────────────────────────────────────────────────────────────
-- A single transaction / sale event.
CREATE TABLE IF NOT EXISTS orders (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT    NOT NULL UNIQUE,             
    customer_id  INTEGER REFERENCES customers(id),
    employee_id  INTEGER REFERENCES employees(id),
    order_date   TEXT    NOT NULL DEFAULT (date('now')),
    status       TEXT    NOT NULL DEFAULT 'completed'
                         CHECK(status IN ('pending', 'completed', 'refunded'))
);

-- ── Order items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    INTEGER NOT NULL REFERENCES orders(id),
    product_id  INTEGER NOT NULL REFERENCES products(id),
    quantity    INTEGER NOT NULL,
    unit_price  REAL    NOT NULL        -- price at time of sale
);