This repository exposes API to the limit order database:

Limit Order APIs
- Retrieves a limit order given the following values
    - GET /retrieveLimitOrders/:address/:token
        - `address`: Orderer Address
        - `token` : Token that the orderer wants to convert BNB to
- Creates a limit order given the following values
    - POST /createLimitOrder
        - POST object with the following values:
            - `ordererAddress`: Orderer Address
            - `tokenInAddress`: Address of the BEP-20 token that the user wants to convert from (usually WBNB)
            - `tokenOutAddress`: Address of the target BEP-20 token that the user wants to convert to
            - `tokenInAmount`: Amount of token that the user wants to convert from
            - `tokenOutAmount`: Amount of the token that the user wants to convert to
            - `slippage`: Maximum slippage that the user allows for the limit order trade
- Deletes a limit order
    - DELETE /deleteLimitOrder/:token/:orderCode
        - `token`: Token which the orderer wants to delete the limit order for (output token for swap)
        - `orderCode`: Code of limit order

- Retrieves all pending limit orders for a token
    - GET /retrievePendingLimitOrders/:token
        - `token`: Token which you want the pending limit orders for

Stop Loss APIs (WIP)
- Retrieves a limit order given the following values
    - GET /retrieveStopLosses/:address/:token
        - `address`: Orderer Address
        - `token` : Token that the orderer wants to convert BNB to
- Creates a stop loss order given the following values
    - POST /createStopLoss
        - POST object with the following values:
            - `ordererAddress`: Orderer Address
            - `tokenInAddress`: Address of the BEP-20 token that the user wants to convert from (usually WBNB)
            - `tokenOutAddress`: Address of the target BEP-20 token that the user wants to convert to
            - `tokenInAmount`: Amount of token that the user wants to convert from
            - `tokenOutAmount`: Amount of token that the user wants to convert to
            - `slippage`: Maximum slippage that the user allows for the stop loss trade
- Deletes a stop loss order
    - DELETE /deleteStopLoss/:token/:orderCode
        - `token`: Token which the orderer wants to delete the stop loss for (output token for swap)
        - `orderCode`: Code of stop loss order
- Retrieves all pending stop loss orders for a token
    - GET /retrievePendingStopLosses/:token
        - `token`: Token which you want the stop loss orders for