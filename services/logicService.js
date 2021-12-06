class LogicService {
  constructor({ systemService, v4, path }) {
    this.systemService = systemService
    this.v4 = v4
    this.path = path
  }

  async processFile(file) {
    const filename = this.v4()
    await this.systemService.mkdir(this.path, (err) => {
      if (!!err && err.code !== 'EEXIST') {
        console.error(err)
        throw err
      }
    })
    await this.systemService.writeFile(`${this.path}/${filename}.csv`, file)
    const { stdout } = await this.systemService.exec(`python3 main.py ${this.path}/${filename}.csv`)
    this.systemService.exec(`rm ${this.path}/${filename}.csv`)
    return stdout.toString()
  }
}
module.exports = LogicService
