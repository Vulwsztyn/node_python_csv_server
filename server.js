const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const morgan = require('morgan')
swaggerDocument = require('./swagger.json')
class Server {
  constructor(app, fileServie, logicService) {
    this.app = app
    this.fileServie = fileServie
    this.logicService = logicService
    this.init()
  }

  init() {
    process.env.NODE_ENV === 'dev' && this.app.use(morgan('dev'))
    this.app.use(
      fileUpload({
        createParentPath: true,
      }),
    )

    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

    this.app.post('/api', async (req, res) => {
      try {
        if (!req.files || !req.files.file) {
          res.send({
            success: false,
            message: 'File is not present',
          })
        } else {
          const file = req.files.file.data.toString('utf-8')
          const result = await this.logicService.processFile(file)
          res.send(result)
        }
      } catch (err) {
        console.error(err)
        res.status(500).send(err)
      }
    })

    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    this.app.get('*', (req, res) => {
      res.send('Hello World!\n')
    })
  }

  listen(port) {
    this.app.listen(port, () => console.log(`App is listening on port ${port}.`))
  }
}

module.exports = Server
