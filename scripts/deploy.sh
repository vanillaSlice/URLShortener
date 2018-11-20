#!/usr/bin/env bash

docker login --username=_ --password="$HEROKU_API_KEY" registry.heroku.com
docker build -t registry.heroku.com/sliceurl/web -f Dockerfile .
docker push registry.heroku.com/sliceurl/web
image_id=$(docker inspect registry.heroku.com/sliceurl/web --format={{.Id}})
payload='{"updates":[{"type":"web","docker_image":"'"$image_id"'"}]}'
curl -n -X PATCH https://api.heroku.com/apps/sliceurl/formation -d "$payload" -H "Content-Type: application/json" -H "Accept: application/vnd.heroku+json; version=3.docker-releases" -H "Authorization: Bearer $HEROKU_API_KEY"
