import express, { Request, Response } from "express";
require('dotenv').config();

const mongoose = require('mongoose');4

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hi, I am home");
});

app.listen(PORT, () => {
  mongoose.connect(uri)
  console.log("Server started at http://localhost:8080");
});
