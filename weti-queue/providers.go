package main

import (
	"context"
	"fmt"

	"github.com/carlmjohnson/requests"
)

type UntypedJson map[string]interface{}

type GeneralProvider interface {
	MakeEndpoint() string
	Fetch(rpc Rpc)
}

type Moralis struct {
	Key string
	Url string
	Ctx context.Context
}

type Infura struct {
	Key string
	Url string
	Ctx context.Context
}

type Alchemy struct {
	Key string
	Url string
	Ctx context.Context
}

func (m Moralis) MakeEndpoint() string {
	return fmt.Sprintf("%s%s", m.Url, m.Key)
}

func (m Moralis) Fetch(rpc Rpc) (*UntypedJson, error) {
	var response UntypedJson

	err := requests.
		URL(m.MakeEndpoint()).
		Accept("application/json").
		BodyJSON(rpc).
		ToJSON(&response).
		Fetch(m.Ctx)

	if err != nil {
		return nil, err
	}

	return &response, err
}
