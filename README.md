# volto-datahub

[![Releases](https://img.shields.io/github/v/release/eea/volto-datahub)](https://github.com/eea/volto-datahub/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-datahub%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-datahub/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-datahub%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-datahub/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub&branch=develop)


EEA DataHub search [Volto](https://github.com/plone/volto) add-on

## Demo

- https://demo-www.eea.europa.eu/en/datahub

## Getting started

### Try volto-datahub with Docker

      git clone https://github.com/eea/volto-datahub.git
      cd volto-datahub
      make
      make start

Go to http://localhost:3000

`make start` now defaults to Volto 18. To run the same setup against Volto 17, use:

      VOLTO_VERSION=17 make
      VOLTO_VERSION=17 make start

### Add volto-datahub to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-datahub"
   ],

   "dependencies": {
       "@eeacms/volto-datahub": "*"
   }
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

   For a legacy Volto 17 project, install the package with `yarn` and restart the frontend as usual.

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-datahub/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-datahub/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-datahub/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
