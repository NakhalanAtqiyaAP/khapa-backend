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

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const dbOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
};

app.use(myConnection(mysql, dbOptions, 'single'));

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', apiRoutes);
app.use('/auth/', middleware, authRoutes);

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
