const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');

dotenv.config();
const DB_CONNECT = process.env.DB_CONNECT;

const app = express();

const config = {
  username: process.env.USERNAME,
  host: process.env.HOST,
  agent: process.env.SSH_AUTH_SOCK,
  port: process.env.PORT,
  dstHost: process.env.DSTHOST,
  dstPort: process.env.DSTPORT,
  password: process.env.PASSWORD
};

tunnel(config, (error) => {
  if (error) {
    console.log("SSH connection error: " + error);
  }

  mongoose
    .connect(
      DB_CONNECT,
      { useNewUrlParser: true, useUnifiedTopology: false }
    )
    .then(() => {
      console.log("Connected to DB.");
    })
    .catch((err) => {
      console.log("Error while DB connecting.");
      console.log(err);
    });
});

app.use(express.json());
app.set('json spaces', 2);
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.listen(9292, () => console.log(`📡 Running on port 9292`));
