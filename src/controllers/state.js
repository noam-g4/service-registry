const state = {}

const setState = action => {
  const update = action({ ...state })
  Object.keys(state).forEach(key => {
    if (!update[key]) return delete state[key]
    Object.keys(state[key]).forEach(sKey => {
      if (state[key][sKey] !== update[key][sKey])
        return (state[key][sKey] = update[key][sKey])
    })
  })
  Object.keys(update).forEach(key => {
    if (!state[key]) state[key] = update[key]
  })
  return state
}

module.exports = {
  getState: () => ({ ...state }),
  setState,
}
