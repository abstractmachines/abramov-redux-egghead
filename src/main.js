import {createStore} from 'redux'

// reducer function w/ ES6 default params
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

// create store
const store = createStore(counter);

const render = () => {
  document.body.innerText = store.getState()
}

store.subscribe(render)

// show initial state:
render()

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT'})
})
