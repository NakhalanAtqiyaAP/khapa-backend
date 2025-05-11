const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const myConnection = require('express-myconnection');
const mysql = require('mysql2');
const middleware = require('./middleware/authMiddleware');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); 

const dbOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
};

app.use(myConnection(mysql, dbOptions, 'single'));

const apiRoutes = require('./routes/api');

app.use('/uploads', express.static(path.join(__dirname, 'img')));

app.use('/api/', apiRoutes);

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
