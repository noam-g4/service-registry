const { Router } = require('express')
const { ServerError, log, parseService } = require('./config')
const { getState } = require('./controllers/state')
const { register, unregister, get, key } = require('./controllers/registry')

const router = Router()

router.put('/:name/:version/:port', (req, res, next) => {
  try {
    const service = parseService(req)
    const isNew = !getState()[key(service)]
    register(service)
    if (isNew) log.info(`REGISTERED SERVICE: ${key(service)}`)
    return res.json({ result: `service: ${key(service)} was registered` })
  } catch (err) {
    return next(err)
  }
})

router.delete('/:name/:version/:port', (req, res, next) => {
  try {
    const service = parseService(req)
    if (!getState()[key(service)])
      throw new ServerError(404, `service: ${key(service)} is not registered`)
    unregister(service)
    log.info(`REMOVED SERVICE: ${key(service)}`)
    return res.json({ result: `service: ${key(service)} was removed` })
  } catch (err) {
    return next(err)
  }
})

router.get('/:name/:version', (req, res, next) => {
  try {
    const { name, version } = req.params
    const service = get(name, version)
    if (!service)
      throw new ServerError(404, `service ${name}-v${version} not found`)
    return res.json({ service })
  } catch (err) {
    return next(err)
  }
})

module.exports = router
