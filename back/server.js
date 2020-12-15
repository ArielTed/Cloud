const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const PORT = process.env.PORT || 9292;
const DB_CONNECT = process.env.DB_CONNECT;

const app = express();

/*mongoose
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
	});*/

app.use(express.json());
app.set('json spaces', 2);
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.listen(PORT, () => console.log(`📡 Running on port ${PORT}`));
