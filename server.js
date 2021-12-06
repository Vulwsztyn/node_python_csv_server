const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4 } = require('uuid')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const { exec } = require('child_process')
const morgan = require('morgan')
swaggerDocument = require('./swagger.json')

async function execPromise(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

async function createFilePromise(file, filename) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(`./uploads/${filename}.csv`, file, (err) => {
      if (!!err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function getPythonScriptResponse(file, filename) {
  const path = './uploads'
  await fs.mkdir(path, (err) => {
    if (!!err && err.code !== 'EEXIST') {
      console.error(err)
      throw err
    }
  })
  await createFilePromise(file, filename)
  const { stdout } = await execPromise(`python3 main.py ./uploads/${filename}.csv`)
  return stdout.toString()
}

class Server {
  constructor(app) {
    this.app = app
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
          const filename = v4()
          const result = await getPythonScriptResponse(file, filename)
          res.send(result)
          await execPromise(`rm ./uploads/${filename}.csv`)
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
