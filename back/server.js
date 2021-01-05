const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require("path")

const queriesRoute = require('./routes/queries');

dotenv.config();
const PORT = process.env.PORT || 8000;
const DB_CONNECT = process.env.DB_CONNECT;

const app = express();

mongoose
  .connect(
    DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch((err) => {
    console.log("Error while DB connecting.");
    console.log(err);
  });

app.use(express.json());
app.set('json spaces', 2);
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "../front", "build")));

app.options('*', cors());

app.use('/', queriesRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front", "build", "index.html"));
});

app.listen(PORT, () => console.log(`📡 Running on port ${PORT}`));
