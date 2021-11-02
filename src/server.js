require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const Web3 = require("web3")
const web3 = new Web3("https://bsc-dataseed.binance.org/");

const { v4: uuidv4  } = require('uuid');
const { tokenPricePool , limitBuyPool, limitSellPool, stopLossPool } = require('./databaseClient');

const port = process.env.PORT

app.use(cors());
app.use(express.json());
app.options('*', cors())

app.get('/', (req, res) => {
  res.send('Utopia Dex Limit Order Manager')
})

app.get('/health', (req, res) => res.send("Healthy"));

// Returns associated limit orders for orderer address
app.get('/retrieveLimitBuys/:address/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_limitBuy where ordererAddress=\"" + req.params.address.toLowerCase() +"\""
    try {
      const [results, fields] = await limitBuyPool.query(query);
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
app.get('/retrievePendingLimitBuys/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_limitBuy where orderStatus='PENDING'"
  console.log("databases", process.env.DB_LIMIT_ORDER);
  console.log("abcde")
    try {
      const [results, fields] = await limitBuyPool.query(query);
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
app.get('/retrieveLimitBuys/:token/:feeTxHash', async (req, res) => {
  const token = req.params.token.toLowerCase();
  const feeTxHash = req.params.feeTxHash.toLowerCase();
  const query = "SELECT * FROM " + token + "_limitBuy where feeTxHash='" + feeTxHash + "'";
    try {
      const [results, fields] = await limitBuyPool.query(query);
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
app.post('/createLimitBuy', async (req, res) => {
  const currentTime = Math.round(new Date() / 1000);
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
  const query = "INSERT INTO " + req.body.tokenOutAddress.toLowerCase() + "_limitBuy VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try {
      await limitBuyPool.query(query, Object.values(orderData));
      res.json({ status: "Success"})
    } catch (error) {
      console.error("error", error);
      res.json({ status: "Failure" });
    }
})


// Deletes 
app.delete('/deleteLimitBuy/:token/:orderCode', async (req, res) => {
  const query = "UPDATE " + req.params.token.toLowerCase() + "_limitBuy SET orderStatus = 'CANCELLED' WHERE orderCode = \"" + req.params.orderCode + "\""
    try {
      const [results, fields] = await limitBuyPool.query(query);
      if (!results[0]) {
        res.json({ status: "Not Found" });
      } else {
        res.json(results[0])
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Returns associated limit buys for orderer address
app.get('/retrieveLimitSells/:address/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_limitSell where ordererAddress=\"" + req.params.address.toLowerCase() +"\""
    try {
      const [results, fields] = await limitSellPool.query(query);
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
app.get('/retrievePendingLimitSells/:token', async (req, res) => {
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_limitSell where orderStatus='PENDING'"
    try {
      const [results, fields] = await limitSellPool.query(query);
      if (!results[0]) {
        res.json({ status: "No pending limit sell orders found for token" });
      } else {
        res.json(results)
      }
    } catch (error) {
      console.error("error", error);
    }
})

// Returns associated limit orders for orderer address
app.get('/retrieveLimitSells/:token/:feeTxHash', async (req, res) => {
  const token = req.params.token.toLowerCase();
  const feeTxHash = req.params.feeTxHash.toLowerCase();
  const query = "SELECT * FROM " + token + "_limitSell where feeTxHash='" + feeTxHash + "'";
    try {
      const [results, fields] = await limitSellPool.query(query);
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
app.post('/createLimitSell', async (req, res) => {
  const currentTime = Math.round(new Date() / 1000);
  const orderData = {
    ordererAddress: req.body.ordererAddress.toLowerCase(),
    tokenInAddress: req.body.tokenInAddress.toLowerCase(),
    tokenOutAddress: req.body.tokenOutAddress.toLowerCase(),
    tokenInAmount: req.body.tokenInAmount,
    tokenOutAmount: req.body.tokenOutAmount,
    tokenPrice: req.body.tokenPrice,
    slippage: req.body.slippage,
    customTaxForToken: req.body.customTaxForToken,
    orderTime: currentTime,
    lastAttemptedTime: 0,
    attempts: 0,
    orderStatus: "PENDING",
    orderCode: uuidv4(),
    feeTxHash: req.body.feeTxHash.toLowerCase(),
    executionTxHash: '0x0',
  }
  console.log("order logged ", orderData);
  const query = "INSERT INTO " + req.body.tokenInAddress.toLowerCase() + "_limitSell VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try {
      await limitSellPool.query(query, Object.values(orderData));
      res.json({ status: "Success"})
    } catch (error) {
      console.error("error", error);
      res.json({ status: "Failure" });
    }
})


// Deletes 
app.delete('/deleteLimitSell/:token/:orderCode', async (req, res) => {
  const query = "UPDATE " + req.params.token.toLowerCase() + "_limitSell SET orderStatus = 'CANCELLED' WHERE orderCode = \"" + req.params.orderCode + "\""
    try {
      const [results, fields] = await limitSellPool.query(query);
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
  const query = "SELECT * FROM " + req.params.token.toLowerCase() + "_stopLoss where ordererAddress=\"" + req.params.address.toLowerCase() +"\""
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
    try {
      const [results, fields] = await stopLossPool.query(query);
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
  const orderData = {
    ordererAddress: req.body.ordererAddress.toLowerCase(),
    tokenInAddress: req.body.tokenInAddress.toLowerCase(),
    tokenOutAddress: req.body.tokenOutAddress.toLowerCase(),
    tokenInAmount: req.body.tokenInAmount,
    tokenOutAmount: req.body.tokenOutAmount,
    tokenPrice: req.body.tokenPrice,
    slippage: req.body.slippage,
    customTaxForToken: req.body.customTaxForToken,
    orderTime: currentTime,
    lastAttemptedTime: 0,
    attempts: 0,
    orderStatus: "PENDING",
    orderCode: uuidv4(),
    feeTxHash: req.body.feeTxHash.toLowerCase(),
    executionTxHash: '0x0',
  }
  console.log("order logged ", orderData);
  const query = "INSERT INTO " + req.body.tokenInAddress.toLowerCase() + "_stopLoss VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
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