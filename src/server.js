require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const Web3 = require("web3")
const web3 = new Web3("https://bsc-dataseed.binance.org/");

const { tokenPricePool , limitOrderPool, stopLossPool } = require('./databaseClient');

const port = process.env.PORT

app.use(cors());
app.use(express.json());
app.options('*', cors())

app.get('/', (req, res) => {
  res.send('Utopia Dex Limit Order Manager')
})

app.get('/health', (req, res) => res.send("Healthy"));

// Returns associated limit orders for orderer address
app.get('/retrieveLimitOrders/:address/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_limitOrder where ordererAddress=\"" + req.params.address.toLowerCase() +"\""
  console.log(query);
    try {
      const [results, fields] = await limitOrderPool.query(query);
      if (!results[0]) {
        res.json({ status: "Not Found" });
      } else {
        res.json(results)
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Creates a limit order
app.post('/createLimitOrder', async (req, res) => {
  const currentTime = Math.round(new Date() / 1000);
  const orderData = {
    ordererAddress: req.body.ordererAddress.toLowerCase(),
    tokenInAddress: req.body.tokenInAddress.toLowerCase(),
    tokenOutAddress: req.body.tokenOutAddress.toLowerCase(),
    tokenInAmount: req.body.tokenInAmount,
    tokenOutAmount: req.body.tokenOutAmount,
    tokenPrice: req.body.tokenOutAmount / req.body.tokenInAmount,
    slippage: req.body.slippage,
    orderTime: currentTime,
    lastAttemptedTime: 0,
    attempts: 0,
    orderStatus: "PENDING",
    orderCode: req.body.ordererAddress.toLowerCase() + "_" + currentTime,
  }
  console.log("order logged ", orderData);
  const query = "INSERT INTO " + req.body.tokenOutAddress.toLowerCase() + "_limitOrder VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try {
      const [results, fields] = await limitOrderPool.query(query, Object.values(orderData));
      res.json({ status: "Success"})
    } catch (error) {
      console.error("error", error);
      res.json({ status: "Failure" });
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