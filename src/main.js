import {createStore} from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'

// reducer function w/ ES6 default params. Specifies how next state calculated.
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
* simple function (stateless, too).
* @param props, which are defined as callbacks in this dumb component
* @return Props, bound to the event handlers of this component.
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
* Pass callbacks that call store.dispatch with appropriate actions.
* @return Dispatch actions get specified here for the callbacks
* which we bound to the event handlers in the Component. Other props (value).
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

// subscribe to Redux store so render() runs any time state changes.
store.subscribe(render)

// show initial state:
render()
