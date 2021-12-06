const express = require('express')
const Server = require('./server')
const SystemService = require('./services/systemService')
const LogicService = require('./services/logicService')
const { promisify } = require('util')
const { exec } = require('child_process')
const fs = require('fs')
const { v4 } = require('uuid')
const app = express()

const port = process.env.PORT || 3000

async function main() {
  const systemService = new SystemService({
    writeFile: promisify(fs.writeFile),
    exec: promisify(exec),
    mkdir: fs.mkdir,
  })
  const logicService = new LogicService({
    v4: v4,
    path: './uploads',
    systemService: systemService,
  })
  const server = new Server(app, systemService, logicService)
  server.listen(port)
}
main()
