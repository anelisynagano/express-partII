const express = require("express");
const app = express();
const connection = require("./db");

require("dotenv").config();

connection.connect((err) => {
  if (err) {
    console.error("error connecting to db");
  } else {
    console.log("connected to db");
  }
});

const essentials = [
  { id: 1, name: "Socks" },
  { id: 2, name: "Computer" },
  { id: 3, name: "Passion" },
];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from route /");
});

app.get("/essentials", (req, res) => {
  res.send(essentials);
});

app.get("/essentials/:id", (req, res) => {
  const oneEssential = essentials.find(
    (essentialItem) => essentialItem.id === +req.params.id
  );
  if (oneEssential) {
    res.send(oneEssential);
  } else {
    res.sendStatus(404);
  }
});

app.post("/essentials", (req, res) => {
  const { name } = req.body;
  const newEssential = { id: essentials.length + 1, name };
  essentials.push(newEssential);
  res.send(newEssential);
});

app.get("/products", (req, res) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving products from db.");
    } else {
      res.json(results);
    }
  });
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM products WHERE id=?",
    [id],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving product");
      } else {
        res.json(results[0]);
      }
    }
  );
});

app.get("/products", (req, res) => {
  const { max_price } = req.query;
  connection.query(
    "SELECT * FROM products WHERE price <= ?",
    [max_price],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving products");
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;
  connection.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding product to db.");
      } else {
        const addedProduct = { id: results.insertId, name, price };
        res.json(addedProduct);
      }
    }
  );
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  connection.query(
    "UPDATE products SET name = ?, price = ? WHERE id = ?",
    [name, price, id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating product to db.");
      } else {
        const editedProduct = { id, name, price };
        res.json(editedProduct);
      }
    }
  );
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting product from db.");
      } else {
        res.send("Product deleted :(");
      }
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
