#!/bin/bash

API="http://localhost:4741"
URL_PATH="/presents"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "present": {
      "subject": "'"${SUBJECT}"'",
      "text": "'"${TEXT}"'"
    }
  }'

echo
