CREATE EXTERNAL TABLE IF NOT EXISTS token_transfers (
    token_address STRING,
    from_address STRING,
    to_address STRING,
    value STRING,
    transaction_hash STRING,
    log_index BIGINT,
    block_number BIGINT
)