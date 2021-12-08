class SystemService {
  constructor({ writeFile, exec, mkdir }) {
    this.writeFile = writeFile
    this.exec = exec
    this.mkdir = mkdir
  }

  writeFile(path, content, callback) {
    this.writeFile(path, content, callback)
  }

  exec(command, callback) {
    this.exec(command, callback)
  }

  mkdir(path, callback) {
    this.mkdir(path, callback)
  }
}
module.exports = SystemService
