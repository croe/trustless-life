// status/index.js

// INITIALIZE
export const initialState = {
  'strength': {
    'value': 2,
    'max': 2
  },
  'intelligence': {
    'value': 2,
    'max': 2
  },
  'energy': {
    'value': 2
  },
  'bitcoin': {
    'value': 2
  },
  'credit': {
    'value': 100
  }
}

// ACTIONS

// const STRENGTH_CHANGE = 'STRENGTH_CHANGE';
// const INTELLIGENCE_CHANGE = 'INTELLIGENCE_CHANGE';
// const ENERGY_CHANGE = 'ENERGY_CHANGE';
// const BITCOIN_CHANGE = 'BITCOIN_CHANGE';
// const TRUST_CHANGE = 'TRUST_CHANGE';

const STATUS_UPDATE = 'STATUS_UPDATE';


// ACTIONS CREATOR

export function setStatus(status) {
  return {
    type: STATUS_UPDATE,
    status
  }
}

// REDUCER

export default function updateStatus(state = initialState, action = {}) {
  switch (action.type) {
    case STATUS_UPDATE:
      return action.status;
    default:
      return state;
  }
}

