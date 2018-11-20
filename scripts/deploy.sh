#!/usr/bin/env bash

docker login --username=_ --password=$(heroku auth:token) registry.heroku.com
heroku container:push web
heroku container:release web
