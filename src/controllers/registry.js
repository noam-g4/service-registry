const semver = require('semver')
const { getState, setState } = require('./state')

const key = ({ name, version, ip, port }) => `${name}-v${version}/${ip}:${port}`

module.exports.register = service =>
  setState(state => ({
    ...state,
    [key(service)]: { ...service, timestamp: Math.floor(new Date() / 1000) },
  }))

module.exports.unregister = service =>
  setState(state => {
    if (state[key(service)]) delete state[key(service)]
    return state
  })

module.exports.get = (name, version) => {
  const candidates = Object.values(getState()).filter(
    s => s.name === name && semver.satisfies(s.version, version)
  )
  return candidates[Math.floor(Math.random() * candidates.length)]
}

module.exports.cleanup = () =>
  setState(state => {
    Object.keys(state).forEach(key => {
      if (Math.floor(new Date() / 1000) - state[key].timestamp > 30)
        delete state[key]
    })
    return state
  })
