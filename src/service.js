const express = require('express')
const router = require('./routes')
const { errorHandler, log, config } = require('./config')

const server = express()

server.use(router)

server.use(errorHandler(log))

server.listen(config.port, () =>
  log.info(`service registry is running on port: ${config.port}`)
)
