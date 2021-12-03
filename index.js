const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

app.use(
  fileUpload({
    createParentPath: true,
  }),
)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

const port = process.env.PORT || 3000

app.post('/api', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      res.send({
        success: false,
        message: 'File is not present',
      })
    } else {
      const file = req.files.file.data.toString('utf-8')
      res.send(file)
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

app.get('*', (req, res) => {
  res.send('Hello World!\n')
})
app.listen(port, () => console.log(`App is listening on port ${port}.`))
