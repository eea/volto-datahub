# @eeacms/volto-datahub

[![Releases](https://img.shields.io/github/v/release/eea/volto-datahub)](https://github.com/eea/volto-datahub/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-datahub%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-datahub/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-datahub&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-datahub)

EEA DataHub search [Volto](https://github.com/plone/volto) add-on

## Demo

- https://demo-www.eea.europa.eu/en/datahub

### Environment variables

The Elasticsearch middleware proxy uses the following environment variables:

- `PROXY_ES_DSN` — default Elasticsearch DSN (e.g. `http://localhost:9200/_all`)
- `PROXY_ES_DSN_${appName}` — per-app DSN override (e.g. `PROXY_ES_DSN_datahub`)

#### Upgrading from 3.x to 4.x

The `RAZZLE_` prefix has been removed from the Elasticsearch middleware environment variable. Update your deployment configuration:

- `RAZZLE_PROXY_ES_DSN` → `PROXY_ES_DSN`
- `RAZZLE_PROXY_ES_DSN_${appName}` → `PROXY_ES_DSN_${appName}`

- https://demo-www.eea.europa.eu/en/datahub

## Upgrade

### Upgrading to 5.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

No API change: the block ids, the schema fields, the API path and the stored block data are the same
as 4.x, so an upgrade renders the same items. The release adds Volto 19 support and moves the
repository to the Volto 19 layout, where the published package lives in
`packages/volto-datahub`.

#### Fix

- External dataset links in the item view open with `rel="noopener noreferrer"` instead of
  `rel="noopener"`, so the target page cannot reach back through `window.opener`.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`), 4.x declared no engine.
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers, 4.x
  declared no peers.
- **The package no longer ships the repository tooling.** The Cypress specs and the Jest setup are
  gone and the unit tests moved to Vitest next to the add-on, so nothing a site imports was removed.

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-datahub": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-datahub'];
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

1. Go to http://localhost:3000

1. Happy editing!

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
