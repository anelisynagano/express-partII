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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
