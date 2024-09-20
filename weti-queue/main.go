package main

import (
	"context"

	"github.com/carlmjohnson/requests"
)

func main() {
	var s string

	ctx := context.Background();

	err := requests.
		URL("http://example.com").
		ToString(&s).
		Fetch(ctx)

	if err != nil {
		return 
	}

	println()
}