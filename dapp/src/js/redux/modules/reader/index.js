// import { createAction } from 'redux-actions'

// status/index.js

// INITIALIZE
export const initialState = {
  'isOpen': false,
  'onScan': false
}


// ACTIONS

const MENU_OPEN = 'MENU_OPEN';
const MENU_CLOSE = 'MENU_CLOSE';
const SCAN_START = 'SCAN_START';
const SCAN_END = 'SCAN_END';
const SCAN_WORKCARD = 'SCAN_WORKCARD';


// ACTIONS CREATOR

export function isOpen() {
  return {
    type: MENU_OPEN
  }
}

export function onClose() {
  return {
    type: MENU_CLOSE
  }
}

export function startScan() {
  return {
    type: SCAN_START
  }
}

export function endScan() {
  return {
    type: SCAN_END
  }
}

export function scanWorkcard(data) {
  return {
    type: SCAN_WORKCARD,
    data
  }
}

// REDUCER

export default function updateReader(state = initialState, action = {}) {
  switch (action.type) {
    case MENU_OPEN:
      return Object.assign({},state,{isOpen: true});
    case MENU_CLOSE:
      return Object.assign({},state,{isOpen: false});
    case SCAN_START:
      return Object.assign({},state,{onScan: true});
    case SCAN_END:
      return Object.assign({},state,{onScan: false});
    case SCAN_WORKCARD:
      return Object.assign({}, state,{onScan: true});
    default:
      return state;
  }
}