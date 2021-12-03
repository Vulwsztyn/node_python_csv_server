# node_python_csv_server

A Simple web server that passes data from an uploaded CSV file to a Python script adn returns its response.

To be run with: `docker-compose up`

Then the "docs" can be found at: http://localhost:3000/swagger

The upload endpoint is at: http://localhost:3000/api

After each PR and master push a laod test is performed using [k6](https://github.com/grafana/k6) to emulate 200 concurrent users.