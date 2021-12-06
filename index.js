const express = require('express')
const Server = require('./server')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const morgan = require('morgan')
swaggerDocument = require('./swagger.json')
const { promisify } = require('util')
const { exec } = require('child_process')
const fs = require('fs')
const { v4 } = require('uuid')

const SystemService = require('./services/systemService')
const LogicService = require('./services/logicService')
const port = process.env.PORT || 3000

function prepareApp(app) {
  process.env.NODE_ENV === 'dev' && app.use(morgan('dev'))
  app.use(
    fileUpload({
      createParentPath: true,
    }),
  )

  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

async function main() {
  const app = express()
  prepareApp(app)
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
