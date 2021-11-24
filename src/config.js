const bunyan = require('bunyan')

class ServerError extends Error {
  constructor(status, message) {
    super(message)
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
    this.status = status || 500
  }
}

module.exports.log = bunyan.createLogger({ name: 'LOG' })

module.exports.config = {
  port: 3000,
  expiration: 30,
}

module.exports.ServerError = ServerError

module.exports.errorHandler = log => (err, _, res, __) => {
  log.error(err.status + ':', err.message)
  return res.status(err.status || 500).send(err.message)
}

module.exports.parseService = req => ({
  ...req.params,
  ip: req.ip.includes('::') ? `[${req.ip}]` : req.ip,
})
