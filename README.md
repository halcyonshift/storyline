## Overview

StoryLine is an open source novel-writing and e-publishing tool

## Features

* Separate parts, chapters and scenes
* Various tools to help with structure and flow
* Grammarly integration
* Insights on structure and productivity
* Import from a growing number of formats, apps and platforms
* Export to ePub, docx, pdf and more

## Support

* [report bugs or make feature requests](https://github.com/halcyonshift/storyline/issues).
* translate for non-English languages

## License

[GNU GPL License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Development

Add an .env.development file to the root directory

```shell
GRAMMARLY_CLIENT_ID=[GRAMMARLY_API_KEY]
DB_NAME=[dev-db]
DB_SCHEMA_VERSION=[1]
MONITOR=[0]
```

```shell
$ yarn
$ yarn start
```

## Testing

```shell
$ yarn test:unit
$ yarn test:integration
```
## Quality Gate

```shell
$ docker run -d -p 8084:9000 sonarqube

$ sonar-scanner \
    -Dsonar.projectKey=StoryLine \
    -Dsonar.sources=. \
    -Dsonar.host.url=http://localhost:8084 \
    -Dsonar.token=sqp_**************************************** \
    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
    -Dsonar.exclusions=**/node_modules/**,**/__test__/**,**/__mock__/**
    -Dsonar.tests=__tests__/unit
```

## SENTRY

```shell
$ yarn test:unit
$ yarn test:integration


## BUILD

```shell
docker run --rm -ti \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 --env GRAMMARLY_CLIENT_ID="client_CxthYkRk9BKWZWGwLB44vz" \
 --env DB_NAME="storyline-prod" \
 --env DB_SCHEMA_VERSION=1 \
 --env SENTRY_DSN="https://41e621e8f6ea49b5b01855d8d13dd496@o215263.ingest.sentry.io/4505164795936768" \
 --env MONITOR=1 \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:wine
```