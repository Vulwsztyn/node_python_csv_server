const { toHaveBeenCalledBefore } = require('jest-extended')
expect.extend({ toHaveBeenCalledBefore })
const LogicService = require('../services/logicService')

describe('logic service', () => {
  let v4, path, systemService, mkdir, writeFile, exec
  beforeEach(() => {
    v4 = jest.fn().mockImplementation(() => 'uuid-1234')
    path = './dir1/dir2'

    mkdir = jest.fn()
    writeFile = jest.fn()
    execOrder = []
    exec = jest.fn().mockImplementation((e) => {
      execOrder.push(e)
      return { stdout: 'result for  my file' }
    })

    systemService = {
      mkdir,
      writeFile,
      exec,
    }
  })
  test('should process file in proper order', async () => {
    const logicService = new LogicService({
      v4,
      systemService,
      path,
    })
    const res = await logicService.processFile('contents of my file')

    // if called
    expect(v4).toHaveBeenCalled()
    expect(mkdir).toHaveBeenCalledWith(path, expect.anything())
    expect(writeFile).toHaveBeenCalledWith('./dir1/dir2/uuid-1234.csv', 'contents of my file')
    expect(exec.mock.calls.length).toBe(2)
    expect(exec).toHaveBeenCalled()
    expect(exec).toHaveBeenCalledWith('python3 main.py ./dir1/dir2/uuid-1234.csv')
    expect(exec).toHaveBeenCalledWith('rm ./dir1/dir2/uuid-1234.csv')

    //if called in proper order
    expect(v4).toHaveBeenCalledBefore(mkdir)
    expect(mkdir).toHaveBeenCalledBefore(writeFile)
    expect(writeFile).toHaveBeenCalledBefore(exec)
    expect(execOrder).toEqual(['python3 main.py ./dir1/dir2/uuid-1234.csv', 'rm ./dir1/dir2/uuid-1234.csv'])

    expect(res).toEqual('result for  my file')
  })
})
