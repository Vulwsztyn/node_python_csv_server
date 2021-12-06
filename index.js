const express = require('express')
const Server = require('./server')
const app = express()

const port = process.env.PORT || 3000

async function main() {
  const server = new Server(app)
  server.listen(port)
}
main()
