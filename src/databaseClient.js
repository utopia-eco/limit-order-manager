const mysql = require('mysql2')

const limitBuyPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_LIMIT_BUY,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // For production
  // host: `${process.env.DB_HOST}`, // For local testing
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 5,
}).promise();

const limitSellPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_LIMIT_SELL,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // For production
  // host: `${process.env.DB_HOST}`, // For local testing
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 5,
}).promise();

const stopLossPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_STOP_LOSS,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // For production
  // host: `${process.env.DB_HOST}`, // For local testing
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 5,
}).promise();

module.exports = {limitBuyPool, limitSellPool, stopLossPool};