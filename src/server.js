require('dotenv').config()

const express = require('express')
const Web3 = require("web3")
const web3 = new Web3("https://bsc-dataseed.binance.org/");
const { tokenPricePool , limitOrderPool, stopLossPool } = require('./databaseClient');
const app = express()
const cors = require('cors')
const port = process.env.PORT

app.use(cors());
app.options('*', cors())

app.get('/', (req, res) => {
  res.send('Utopia Dex Limit Order Manager')
})

app.get('/health', (req, res) => res.send("Healthy"));

// Returns associated limit orders for orderer address
app.get('/retrieveLimitOrders/:address/:token', async (req, res) => {
  const query = "SELECT * FROM " + token + "where ordererAddress = "
    try {
      const [results, fields] = await limitOrderPool.query(query);
      if (!results[0]) {
        res.json({ status: "Not Found" });
      } else {
        res.json(results[0])
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Creates a limit order
app.post('/createLimitOrder', async (req, res) => {
  const currentTime = Math.round(new Date() / 1000);
  const orderData = {
    ordererAddress: req.body.ordererAddress,
    tokenInAddress: req.body.tokenInAddress,
    tokenOutAddress: req.body.tokenOutAddress,
    tokenInValue: req.body.tokenInValue,
    tokenOutValue: req.body.tokenOutValue,
    tokenPrice: req.body.tokenPrice,
    slippage: req.body.slippage,
    orderTime: currentTime,
    lastAttemptedTime: 0,
    attempts: 0,
    orderStatus: "PENDING",
    orderCode: req.body.ordererAddress + "_" + currentTime,
  }
  const query = "INSERT INTO " + req.body.tokenOutAddress + "_limitOrder VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try {
      const [results, fields] = await limitOrderPool.query(query, Object.values(orderData));
      if (!results[0]) {
        res.json({ status: "Not Found" });
      } else {
        res.json(results[0])
      }
    } catch (error) {
      console.error("error", error);
    }
})


// Deletes 
app.delete('/deleteLimitOrder/:token/:orderCode', async (req, res) => {
  const query = "DELETE * FROM " + req.params.token + "_limitOrder WHERE orderCode = " + req.params.orderCode
    try {
      const [results, fields] = await limitOrderPool.query(query);
      if (!results[0]) {
        res.json({ status: "Not Found" });
      } else {
        res.json(results[0])
      }
    } catch (error) {
      console.error("error", error);
    }
})


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})