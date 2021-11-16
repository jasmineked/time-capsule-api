#!/bin/bash

API="http://localhost:4741"
URL_PATH="/presents"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "present": {
      "subject": "'"${SUBJECT}"'",
      "text": "'"${TEXT}"'"
    }
  }'

echo
