import merge from "deepmerge"

const isPlainEnoughObject = (o) => {
    return o !== null && !Array.isArray(o) && typeof o === 'object'
  }

export const autoDeepMerge = (inboundState, originalState, reducedState, { debug }) => {
    let newState = { ...reducedState }

    if (inboundState && typeof inboundState === 'object') {
      Object.keys(inboundState).forEach(key => {
        if (key === "_persist") return
        if (originalState[key] !== reducedState[key]) {
          if (process.env.NODE_ENV !== 'production' && debug)
          console.log(
            'redux-persist/stateReconciler: sub state for key `%s` modified, skipping.',
            key
          )
        return
        }

        if (isPlainEnoughObject(reducedState[key])) {
          // if object is plain enough shallow merge the new values (hence "Level2")
          newState[key] = merge(newState[key], inboundState[key]);
          return
        }

        newState[key] = inboundState[key]
      })
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      debug &&
      inboundState &&
      typeof inboundState === 'object'
    )
      console.log(
        `redux-persist/stateReconciler: rehydrated keys '${Object.keys(
          inboundState
        ).join(', ')}'`
      )
  
    return newState
  }