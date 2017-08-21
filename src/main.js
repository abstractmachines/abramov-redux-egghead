console.log('hi')

// reducer function
const counter = (state = 0, action) => {
  switch(action.type) {
      case 'INCREMENT':
      return state + 1;
      case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// replace this with import {createStore} from 'redux';
const { createStore } = Redux;

const store = createStore(counter);

console.log(store.getState());
