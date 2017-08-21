import {createStore} from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'

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

/** Since change is stored in Redux store, Counter component can be a
* simple function.
* @param JSX rendered in args by name and defined within the arrow function
* @return All JSX required for rendering of this Component (function).
* Recall that all adjacent JSX elements must be wrapped in enclosing DIV tag.
*/
const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

// create store
const store = createStore(counter);

/** Render is called anytime store state changes, so I can pass current
* state of store as a prop to root component.
* Dispatch actions as props in the rendered Component.
* @return Rendered Component specified, inside root element of app.
*/
const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() =>
        store.dispatch({
          type: 'INCREMENT'
        })
      }
      onDecrement={() =>
        store.dispatch({
          type: 'DECREMENT'
        })
      }
    />,
    document.getElementById('root')
  )
}

store.subscribe(render)

// show initial state:
render()
