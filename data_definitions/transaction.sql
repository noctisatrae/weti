CREATE EXTERNAL TABLE IF NOT EXISTS transactions (
    hash STRING,
    nonce BIGINT,
    block_hash STRING,
    block_number BIGINT,
    transaction_index BIGINT,
    from_address STRING,
    to_address STRING,
    value DECIMAL(38,0),
    gas BIGINT,
    gas_price BIGINT,
    input STRING,
    max_fee_per_gas BIGINT,
    max_priority_fee_per_gas BIGINT,
    transaction_type BIGINT
)

-- {
--     "id":1,
--     "jsonrpc":"2.0",
--     "result":{ <== RELEVANT TO US
--       "accessList":[],
--       "blockHash":"0x0155db99111f10086bad292d3bd0be9472aff9cf0f33d7d35f2db4814ffad0f6",
--       "blockNumber":"0x112418d",
--       "chainId":"0x1",
--       "from":"0xe2a467bfe1e1bedcdf1343d3a45f60c50e988696",
--       "gas":"0x3c546",
--       "gasPrice":"0x20706def53",
--       "hash":"0xce0aadd04968e21f569167570011abc8bc17de49d4ae3aed9476de9e03facff9",
--       "input":"0xb6f9de9500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000e2a467bfe1e1bedcdf1343d3a45f60c50e9886960000000000000000000000000000000000000000000000000000000064e54a3b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000de15b9919539113a1930d3eed5088cd10338abb5",
--       "maxFeePerGas":"0x22b05d8efd",
--       "maxPriorityFeePerGas":"0x1bf08eb000",
--       "nonce":"0x12c",
--       "r":"0xa07fd6c16e169f0e54b394235b3a8201101bb9d0eba9c8ae52dbdf556a363388",
--       "s":"0x36f5da9310b87fefbe9260c3c05ec6cbefc426f1ff3b3a41ea21b5533a787dfc",
--       "to":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
--       "transactionIndex":"0x0",
--       "type":"0x2",
--       "v":"0x1",
--       "value":"0x2c68af0bb140000",
--       "yParity":"0x1"
--    }
-- }