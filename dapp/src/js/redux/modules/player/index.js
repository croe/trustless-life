// status/index.js

// INITIALIZE
const initialState = {
  'name': 'akihiro',
  'works': [],
  'turn_action': 1
}


// ACTIONS

const PLAYER_CHANGE = 'PLAYER_CHANGE';
const ADD_WORK = 'ADD_WORK';
const INCREASE_ACTION = 'INCREASE_ACTION';
const DECREASE_ACTION = 'DECREASE_ACTION';

// REDUCER

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PLAYER_CHANGE:
      return state;
    case ADD_WORK:
      console.log(state)
      return Object.assign({}, state, state.works.push(action.data));
    case INCREASE_ACTION:
      return Object.assign({}, state, {turn_action: state.turn_action + 1 });
    case DECREASE_ACTION:
      return Object.assign({}, state, {turn_action: state.turn_action - 1 });
    default:
      return state;
  }
}


// ACTIONS CREATOR

export function updatePlayerConfig(config) {
  return {type: PLAYER_CHANGE, config}
}

export function addWork(data) {
  console.log(data)
  return {
    type: ADD_WORK,
    data: data
  }
}

export function decreaseAction(){
  return {
    type: DECREASE_ACTION
  }
}

export function increaseAction(){
  return {
    type: INCREASE_ACTION
  }
}