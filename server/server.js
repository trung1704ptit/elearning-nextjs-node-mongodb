import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from 'mongoose';

const morgan = require("morgan");
require("dotenv").config();

// create express app
const app = express();

// db connection
mongoose.connect(process.env.DATABASE, {
  userNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => console.log('*******DB connected********'))
.catch(error => console.log('DB connection error => ', error))

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// route
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
