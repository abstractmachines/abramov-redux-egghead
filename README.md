# Learning Redux with Dan Abramov
These are my notes, paraphrasing what I've learned from watching [this video series,](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree) along with some other CS concepts and things along the way.

## Start

`npm install`

`npm start`

Go to `localhost:3000`

## Principles of Redux
### First Principle: All state managed in single object
This is called the state, or state tree
### Second Principle: State Tree is read-only
To change it, you must dispatch an action (a plain JS object which describes that change, in which type is the only required property).

>>> Just as state is the minimal representation of the app's data,

>>> Action is the minimal representation of changes to that data.

Usually, the action is a string because strings are serializable.

### Third Principle: A pure function takes previous state + action being dispatched to create a new state

Since it's a pure function, it will hence return a new object instead of mutating the existing object. Hence, you can see that *all* of Redux operates on Functional Programming concepts, with pure functions that do not have side effects and create new data instead of mutating existing data. For more information, see [Eric Elliot's article on Pure Functions on Medium](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976).

The Reducer Function creates a new object for the whole state, but keeps reference to previous versions (for 'time travel'), which can also be thought of as 'record and replay of state.'

Redux marries the React concept of `"UI/View Layer being the most predictable when it is a pure function of the app state"` which has caught on in Ember and other things, along with `"state mutations in app are a pure function."`

In conclusion, it's the Reducer function which manages this immutable state concept in Redux.

---

`Dispatch` an action; that'll update state.

`Subscribe` to that state change to update the DOM.

Use `getState()` to render the current state.

---

## Working Redux Examples

#### There are 3 primary methods for the Redux store:

- store.getState()

    Gets current state of store

- store.dispatch(action)

    Dispatches an action

    Most commonly used

- store.subscribe()

   Registers a callback which is called whenever an action gets dispatched so that you can update the UI to reflect current app state (think Publish-Subscribe or Observer patterns here, which would be dependent on whether subject has a registered list of listeners or whether it's simple broadcast)


#### Console Example: Dispatch action and get new state
```
import {createStore} from 'redux'

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
// create store
const store = createStore(counter);

// initial state is 0:
console.log(store.getState()); // 0

// new state is 1:
store.dispatch({ type: 'INCREMENT' })

console.log(store.getState()); // 1

// next state is still 1, action is unknown:
store.dispatch({ type: 'FOO' })

console.log(store.getState()); // 1
```

#### Naive DOM Example: 3 Redux Store methods

We will use the native DOM API instead of React here.

- store.getState()
- store.dispatch(action)
- store.subscribe()

```
import {createStore} from 'redux'

// reducer function, same as before

// create store
const store = createStore(counter);

// getState() method is rendered,
const render = () => {
  document.body.innerText = store.getState()
}

// subscribe for callback invoked upon state change,
store.subscribe(render)

// show initial state by invoking render function once directly,
render()

// dispatch an action.
document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT'})
})
```
Expected result: DOM will show 0,
upon clicking, DOM will show 1 ... 2 ... 3 ...  etc.

#### DOM example: use React instead of using native DOM API

```
// Ensure you install babel-preset-react to render JSX as well as these.
import {createStore} from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'

// reducer function, same as before

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
```


## ES6 stuff

### ES6 Default Params
```
const counter = (state = 0, action)
```

- `state = 0` initializes state to initial state

- Very similar to parameter initialization in C++
