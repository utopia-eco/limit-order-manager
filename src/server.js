require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const Web3 = require("web3")
const web3 = new Web3("https://bsc-dataseed.binance.org/");

const { v4: uuidv4  } = require('uuid');
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

// Returns associated limit orders for orderer address
app.get('/retrievePendingLimitOrders/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_limitOrder where orderStatus='PENDING'"
  console.log(query);
    try {
      const [results, fields] = await limitOrderPool.query(query);
      if (!results[0]) {
        res.json({ status: "No pending orders found for token" });
      } else {
        res.json(results)
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Returns associated limit orders for orderer address
app.get('/retrieveLimitOrders/:token/:feeTxHash', async (req, res) => {
  const token = req.params.token.toLowerCase();
  const feeTxHash = req.params.feeTxHash.toLowerCase();
  const query = "SELECT * FROM " + token + "_limitOrder where feeTxHash='" + feeTxHash + "'";
  console.log(query);
    try {
      const [results, fields] = await limitOrderPool.query(query);
      if (!results[0]) {
        res.json({ status: "No pending orders found for given input of " + token + " with fee txHash of " + feeTxHash });
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
  console.log(uuidv4());
  const orderData = {
    ordererAddress: req.body.ordererAddress.toLowerCase(),
    tokenInAddress: req.body.tokenInAddress.toLowerCase(),
    tokenOutAddress: req.body.tokenOutAddress.toLowerCase(),
    tokenInAmount: req.body.tokenInAmount,
    tokenOutAmount: req.body.tokenOutAmount,
    tokenPrice: req.body.tokenPrice,
    slippage: req.body.slippage,
    orderTime: currentTime,
    lastAttemptedTime: 0,
    attempts: 0,
    orderStatus: "PENDING",
    orderCode: uuidv4(),
    feeTxHash: req.body.feeTxHash.toLowerCase(),
    executionTxHash: '0x0',
  }
  console.log("order logged ", orderData);
  const query = "INSERT INTO " + req.body.tokenOutAddress.toLowerCase() + "_limitOrder VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try {
      await limitOrderPool.query(query, Object.values(orderData));
      res.json({ status: "Success"})
    } catch (error) {
      console.error("error", error);
      res.json({ status: "Failure" });
    }
})


// Deletes 
app.delete('/deleteLimitOrder/:token/:orderCode', async (req, res) => {
  const query = "UPDATE " + req.params.token.toLowerCase() + "_limitOrder SET orderStatus = 'CANCELLED' WHERE orderCode = \"" + req.params.orderCode + "\""
  console.log(query);
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

// Returns associated stop loss orders for orderer address
app.get('/retrieveStopLosses/:address/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_limitOrder where ordererAddress=\"" + req.params.address.toLowerCase() +"\""
  console.log(query);
    try {
      const [results, fields] = await stopLossPool.query(query);
      if (!results[0]) {
        res.json({ status: "Not Found" });
      } else {
        res.json(results)
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Returns associated stop loss orders for orderer address
app.get('/retrievePendingStopLosses/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_stopLoss where orderStatus='PENDING'"
  console.log(query);
    try {
      const [results, fields] = await limitOrderPool.query(query);
      if (!results[0]) {
        res.json({ status: "No pending orders found for token" });
      } else {
        res.json(results)
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Returns associated limit orders for orderer address
app.get('/retrieveStopLosses/:token/:feeTxHash', async (req, res) => {
  const token = req.params.token.toLowerCase();
  const feeTxHash = req.params.feeTxHash.toLowerCase();
  const query = "SELECT * FROM " + token + "_stopLoss where feeTxHash='" + feeTxHash + "'";
  console.log(query);
    try {
      const [results, fields] = await stopLossPool.query(query);
      if (!results[0]) {
        res.json({ status: "No pending orders found for given input of " + token + " with fee txHash of " + feeTxHash });
      } else {
        res.json(results)
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Creates a stop loss order order
app.post('/createStopLoss', async (req, res) => {
  const currentTime = Math.round(new Date() / 1000);
  console.log(uuidv4());
  const orderData = {
    ordererAddress: req.body.ordererAddress.toLowerCase(),
    tokenInAddress: req.body.tokenInAddress.toLowerCase(),
    tokenOutAddress: req.body.tokenOutAddress.toLowerCase(),
    tokenInAmount: req.body.tokenInAmount,
    tokenOutAmount: req.body.tokenOutAmount,
    tokenPrice: req.body.tokenPrice,
    slippage: req.body.slippage,
    orderTime: currentTime,
    lastAttemptedTime: 0,
    attempts: 0,
    orderStatus: "PENDING",
    orderCode: uuidv4(),
    feeTxHash: req.body.feeTxHash.toLowerCase(),
    executionTxHash: '0x0',
  }
  console.log("order logged ", orderData);
  const query = "INSERT INTO " + req.body.tokenInAddress.toLowerCase() + "_stopLoss VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try {
      await stopLossPool.query(query, Object.values(orderData));
      res.json({ status: "Success"})
    } catch (error) {
      console.error("error", error);
      res.json({ status: "Failure" });
    }
})


// Deletes 
app.delete('/deleteStopLoss/:token/:orderCode', async (req, res) => {
  const query = "UPDATE " + req.params.token.toLowerCase() + "_stopLoss SET orderStatus = 'CANCELLED' WHERE orderCode = \"" + req.params.orderCode + "\""
  console.log(query);
    try {
      const [results, fields] = await stopLossPool.query(query);
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