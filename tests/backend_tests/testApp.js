import express from "express";
import { createStore } from "../../backend/controllers/stores.controllers.js";

const app = express();
app.use(express.json());

// ✅ Fake auth middleware
app.use((req, res, next) => {
  req.user = {
    _id: "user123",
    userName: "testuser"
  };
  next();
});

// Route under test
app.post("/stores", createStore);

export default app;
