## Overview

StoryLine is an open source novel-writing and e-publishing app

## Features

* Separate parts, chapers and scenes
* Granular tagging by scene or text
* Insights

## Support

* [report bugs or make feature requests](https://github.com/halcyonshift/storyline/issues).
* translate for non-English languages

## License

[GNU GPL License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Development

Add an .env file to the root directory

```shell
GRAMMARLY_CLIENT_ID=[GRAMMARLY_API_KEY]
DB_SCHEMA_VERSION=[1]
DB_NAME=[dev-db]
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