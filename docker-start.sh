# shellcheck disable=SC2028
echo "\n Run migration:"
node ace migration:run

echo "\n Start node server:"
echo "\n 0.0.0.0:3333"

nodemon  server.js --dev --polling
