#!/usr/bin/env bash

pytest --cov=$(dirname $0)/../urlshortener/ --cov-fail-under=70 -W ignore::DeprecationWarning
