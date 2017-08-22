import {createStore} from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

/* ***** ***** TEST : ADD / REMOVE COUNTERS ***** ***** */
/**
* @param list of counter states
* @return New list with appended state.
* Could also be:
* return[...list, 0]
*/
const addCounter = (list) => {
  return list.concat([0])
}

const rmvCounter = (list) => {
  return list.slice(1)
}

/** Slice [0, 2] out of [0, 1, 2]
* Using a method chain with slice and concat
* OR, ES6 destructuring madness
* @return [0, 2]
*/
const timeTravel = (list, index) => {
  // oldies but goodies:
  // return list
  //   .slice(0,index)
  //   .concat(list.slice(index+1))

  // equivalent ES6 spread operator:
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ]
}

/** test addCounter
* @return A list of states, with a single first count of 1 appended.
*/
const testAddCounter = () => {
  const listBefore = []
  const listAfter = [0]

  deepFreeze(listBefore)

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter)
}

testAddCounter();
console.log('All tests passed, testAddCounter.')

/** test rmvCounter
* @return A list of counter states with only 0 in it
*/
const testRmvCounter = () => {
  const listBefore = [0]
  const listAfter = []

  deepFreeze(listBefore)

  expect(
    rmvCounter(listBefore)
  ).toEqual(listAfter)
}

testRmvCounter();
console.log('All tests passed, testRmvCounter.')

/** test timeTravel: see, this is why we save states. Select 'em!
* @return [0, 2] out of [0, 1, 2]
*/
const testTimeTravel = () => {
  const listBefore = [0, 1, 2]
  const listAfter = [0,2]

  deepFreeze(listBefore)

  expect(
    timeTravel (listBefore,1)
  ).toEqual(listAfter)
}

testTimeTravel();
console.log('All tests passed, timeTravel.')


/* ***** ***** TEST : INCREMENT / DECREMENT COUNTERS ***** ***** */

/** Increment counter
* @return [10, 21, 30]
* increment at position index 1
*/
const incrementCounter = (list, index) => {
  // old school:
   return list
    .slice(0,index)
    .concat([list[index]+ 1])
    .concat(list.slice(index + 1))

  // equivalent ES6 spread operator which choked on my dependencies:
  // return
  // ...list.slice(0,index),
  // list[index] + 1,
  // ...list.slice(index + 1)
}

/** test increment counter
* @return A list of states, with a single first count of 1 appended.
*/
const testIncrementCounter = () => {
  const listBefore = [10, 20, 30]
  const listAfter = [10, 21, 30]

  deepFreeze(listBefore)

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter)
}

testIncrementCounter();
console.log('All tests passed, testIncrementCounter.')

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
