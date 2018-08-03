// status/index.js

// INITIALIZE
const initialState = {
  'name': 'akihiro',
  'works': []
}


// ACTIONS

const PLAYER_CHANGE = 'PLAYER_CHANGE';

// REDUCER

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PLAYER_CHANGE:
      return state;
    default:
      return state;
  }
}


// ACTIONS CREATOR

export function updatePlayerConfig(config) {
  return {type: PLAYER_CHANGE, config}
}