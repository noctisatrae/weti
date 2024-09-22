package main

type Rpc interface{}

type RpcResponse struct {
	Id   int
	Data UntypedJson
}
