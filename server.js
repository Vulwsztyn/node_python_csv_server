class Server {
  constructor(app, fileServie, logicService) {
    this.app = app
    this.fileServie = fileServie
    this.logicService = logicService
    this.init()
  }

  init() {
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

    this.app.get('*', (req, res) => {
      res.send('Hello World!\n')
    })
  }

  listen(port) {
    this.app.listen(port, () => console.log(`App is listening on port ${port}.`))
  }
}

module.exports = Server
