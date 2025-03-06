const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Rota para obter todos os items
app.get("/api/items", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "items.json"),
      "utf8",
    );
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Error reading items" });
  }
});

// Rota para adicionar um novo item
app.post("/api/items", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "items.json"),
      "utf8",
    );
    const items = JSON.parse(data);
    const newItem = req.body;
    newItem.id = Math.max(...items.items.map((item) => item.id)) + 1;
    items.items.push(newItem);
    await fs.writeFile(
      path.join(__dirname, "data", "items.json"),
      JSON.stringify(items, null, 2),
    );
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding item" });
  }
});

// Rota para atualizar um item
app.put("/api/items/:id", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "items.json"),
      "utf8",
    );
    const items = JSON.parse(data);
    const id = parseInt(req.params.id);
    const itemIndex = items.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    items.items[itemIndex] = { ...req.body, id };
    await fs.writeFile(
      path.join(__dirname, "data", "items.json"),
      JSON.stringify(items, null, 2),
    );
    res.json(items.items[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

// Rota para deletar um item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "items.json"),
      "utf8",
    );
    const items = JSON.parse(data);
    const id = parseInt(req.params.id);
    items.items = items.items.filter((item) => item.id !== id);
    await fs.writeFile(
      path.join(__dirname, "data", "items.json"),
      JSON.stringify(items, null, 2),
    );
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
});

// Rota para servir o admin.html
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Rota para servir o customer.html
app.get("/customer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "customer.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
