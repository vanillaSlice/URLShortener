#!/usr/bin/env bash

heroku login
heroku container:login
heroku container:push web
heroku container:release web
