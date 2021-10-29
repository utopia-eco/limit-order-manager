This repository exposes API to the limit order database:

Limit Order APIs
- Retrieves a limit order given the following values
    - GET /retrieveLimitBuy/:address/:token
        - `address`: Orderer Address
        - `token` : Token that the orderer wants to convert BNB to
- Creates a limit order given the following values
    - POST /createLimitBuy
        - POST object with the following values:
            - `ordererAddress`: Orderer Address
            - `tokenInAddress`: Address of the BEP-20 token that the user wants to convert from (usually WBNB)
            - `tokenOutAddress`: Address of the target BEP-20 token that the user wants to convert to
            - `tokenInAmount`: Amount of token that the user wants to convert from
            - `tokenOutAmount`: Amount of the token that the user wants to convert to
            - `tokenPrice`: Price at which the order will execute
            - `slippage`: Maximum slippage that the user allows for the limit order trade
            - `feeTxHash`: Transaction hash of fee paid for order creation
- Deletes a limit order
    - DELETE /deleteLimitBuy/:token/:orderCode
        - `token`: Token which the orderer wants to delete the limit order for (output token for swap)
        - `orderCode`: Code of limit order

- Retrieves all pending limit orders for a token
    - GET /retrievePendingLimitBuys/:token
        - `token`: Token which you want the pending limit orders for

- Retrieves limit order associated with token and fee transaction hash
    - GET /retrieveLimitBuys/:token/:feeTxHash
        - `token`: Token which is associated with limit order
        - `feeTxHash`: Transaction hash of feepaid for order creation

Limit Sell APIs
- Retrieves a limit order given the following values
    - GET /retrieveLimitSells/:address/:token
        - `address`: Orderer Address
        - `token` : Token that the orderer wants to convert to BNB
    
- Creates a stop loss order given the following values
    - POST /createLimitSell
        - POST object with the following values:
            - `ordererAddress`: Orderer Address
            - `tokenInAddress`: Address of the BEP-20 token that the user wants to convert from (usually WBNB)
            - `tokenOutAddress`: Address of the target BEP-20 token that the user wants to convert to (Should be WBNB for now)
            - `tokenInAmount`: Amount of token that the user wants to convert from
            - `tokenOutAmount`: Amount of token that the user wants to convert to
            - `tokenPrice`: Price at which the order will execute
            - `slippage`: Maximum slippage that the user allows for the stop loss trade
            - `customTaxForToken`: Whether the token has a custom tax (true/false)
            - `feeTxHash`: Transaction hash of fee paid for order creation
        
- Deletes a stop loss order
    - DELETE /deleteLimitSell/:token/:orderCode
        - `token`: Token which the orderer wants to delete the limit sell for (output token for swap)
        - `orderCode`: Code of limit sell order

- Retrieves all pending stop loss orders for a token
    - GET /retrievePendingLimitSells/:token
        - `token`: Token which you want the limit sell orders for

- Retrieves stop loss order associated with token and fee transaction hash
    - GET /retrieveLimitSells/:token/:feeTxHash
        - `token`: Token which is associated with limit sell order
        - `feeTxHash`: Transaction hash of feepaid for order creation

Stop Loss APIs
- Retrieves a limit order given the following values
    - GET /retrieveStopLosses/:address/:token
        - `address`: Orderer Address
        - `token` : Token that the orderer wants to convert to BNB
    
- Creates a stop loss order given the following values
    - POST /createStopLoss
        - POST object with the following values:
            - `ordererAddress`: Orderer Address
            - `tokenInAddress`: Address of the BEP-20 token that the user wants to convert from (usually WBNB)
            - `tokenOutAddress`: Address of the target BEP-20 token that the user wants to convert to (Should be WBNB for now)
            - `tokenInAmount`: Amount of token that the user wants to convert from
            - `tokenOutAmount`: Amount of token that the user wants to convert to
            - `tokenPrice`: Price at which the order will execute
            - `slippage`: Maximum slippage that the user allows for the stop loss trade
            - `customTaxForToken`: Whether the token has a custom tax (true/false)
            - `feeTxHash`: Transaction hash of fee paid for order creation
        
- Deletes a stop loss order
    - DELETE /deleteStopLoss/:token/:orderCode
        - `token`: Token which the orderer wants to delete the stop loss for (output token for swap)
        - `orderCode`: Code of stop loss order

- Retrieves all pending stop loss orders for a token
    - GET /retrievePendingStopLosses/:token
        - `token`: Token which you want the stop loss orders for

- Retrieves stop loss order associated with token and fee transaction hash
    - GET /retrieveStopLosses/:token/:feeTxHash
        - `token`: Token which is associated with stop loss order
        - `feeTxHash`: Transaction hash of feepaid for order creation