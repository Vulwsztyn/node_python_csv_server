const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { v4 } = require('uuid')
const { exec } = require('child_process')
const fs = require('fs')

const app = express()

const swaggerUi = require('swagger-ui-express')
swaggerDocument = require('./swagger.json')

app.use(
  fileUpload({
    createParentPath: true,
  }),
)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
process.env.NODE_ENV === 'dev' && app.use(morgan('dev'))

const port = process.env.PORT || 3000

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

app.post('/api', async (req, res) => {
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

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('*', (req, res) => {
  res.send('Hello World!\n')
})
app.listen(port, () => console.log(`App is listening on port ${port}.`))
