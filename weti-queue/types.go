package main

type Job struct {
	Id         int      `json:"id"`
	ChainId    uint     `json:"chainId"`
	Frequency  uint     `json:"frequency"`
	Expiration string   `json:"expiration"`
	Provider   Provider `json:"provider"`
	Rpc        Rpc      `json:"rpc"`
}

// ? It's an alias so I don't really know if it's needed...
type UntypedJson map[string]interface{}

type GetJobRequest struct {
	Limit int `json:"limit"`
}

type Rpc interface{}

type RpcResponse struct {
	Id   int
	Data UntypedJson
}
