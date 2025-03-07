const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const adminData = require("./data/admin.json");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

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

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === adminData.username && password === adminData.password) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/customer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "customer.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
