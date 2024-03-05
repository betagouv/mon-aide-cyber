#! /usr/bin/env bash

openfga migrate --timeout=10s \
  && openfga run
