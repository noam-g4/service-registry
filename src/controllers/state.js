require('dotenv').config()
const { readFile, writeFile } = require('fs/promises')
const { join } = require('path')

const stateFilePath = join(__dirname, '../', '../', `/${process.env.STATE}`)

const getState = async (path = stateFilePath) => {
  try {
    const file = await readFile(path)
    return JSON.parse(file)
  } catch (err) {
    return []
  }
}

const dispatch = async (action, path = stateFilePath) => {
  try {
    const state = await getState()
    const newState = action(state)
    await writeFile(path, JSON.stringify(newState, null, 4))
    return newState
  } catch (err) {
    return err
  }
}

module.exports = {
  getState,
  dispatch,
}
