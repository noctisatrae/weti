package main

import (
	"net/url"

	"github.com/go-pg/pg/v10"
)

type NoPassword struct{}

func (e *NoPassword) Error() string {
	return "password is not provided in the DB url"
}

func ParsePgUrl(pgurl string) (pg.Options, error) {
	u, err := url.Parse(pgurl)
	if err != nil {
		return pg.Options{}, err
	}

	psswd, set := u.User.Password()
	if set != true {
		return pg.Options{}, &NoPassword{}
	}

	return pg.Options{
		Addr:     u.Host,
		User:     u.User.Username(),
		Password: psswd,
	}, nil
}
