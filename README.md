# Ecommerce Application

```bash
✗ tree -d -L 2
.
├── data
│   ├── postgres
│   ├── redis
│   └── web
├── ecommerce_api
│   ├── ecommerce
│   └── __pycache__
├── ecommerce_app
│   ├── node_modules
│   ├── public
│   └── src
└── nginx
```

## Frontend
The ecommerce frontend is a React-TypeScript application. This application was created with [Create React App](https://create-react-app.dev/docs/adding-typescript/):
`npx create-react-app <app_name> --template typescript`
All frontend code exists in `ecommerce_app`. The `src` directory contains all the pages, components, etc. 

## Backend
The ecommerce api is a Python (3) Flask application. You can find all the code for the API in `ecommerce_api`

## Nginx
Nginx acts as a reverse proxy for the suite of applications so we can "serve" a single application on port 80, dispatch calls to "/api" to the API running on port 5000, and the rest to the frontend running on port 3000.

Examples:
Making a request to `http://localhost/login` (technically `http://localhost:80/login`) serves the frontend's login page (akin to making a request to `http://localhost:3000/login`)

On the other hand, making a request to `http://localhost/api/products` proxies the request to `http://localhost:5000/products` (note the missing `/api` in the second url)


## Storage
The ecommerce application uses Postgres 14 for relational data and Redis + `cachelib` as a key/value store.

## Metrics
Metrics are exported to Prometheus via the [Prometheus Flask Exporter](https://github.com/rycus86/prometheus_flask_exporter). Prometheus is reachable via the docker-compose network on http://prometheus:9090

Grafana is configured to use Prometheus as a datasource. To view metrics in Grafana, go to http://localhost:3001/ and use the default credentials (admin:admin)

## Asynchronous Tasks
We use [Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html) for asynchronous tasks with the Redis as the broker.

## Local Development

Start all components of the service with 
```bash
docker-compose up
```

To bring the services up and rebuild, provide the `--build` argument to docker-compose:
```bash
docker-compose up --build
```
