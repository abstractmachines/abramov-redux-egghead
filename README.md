# Learning Redux with Dan Abramov (and Eric Elliott)
These are my notes, paraphrasing what I've learned from watching [this video series,](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree) along with some other CS concepts and things along the way.

# Table of Contents
1. Start
2. Principles
3. Basic examples (console, DOM, and React)
4. Functional Programming (FP) and Redux time travel
5. FP examples
6. ES6 treats
7. Why spread operator isn't always the answer for nested data

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

Since it's a pure function, it will hence return a new object instead of mutating the existing object. Hence, you can see that *all* of Redux operates on Functional Programming concepts, with pure functions that do not have side effects and create new data instead of mutating existing data. For more information, see [Eric Elliott's article on Pure Functions on Medium](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976).

The Reducer Function creates a new object for the whole state, but keeps reference to previous versions (for 'time travel'), which can also be thought of as 'record and replay of state.'

There are examples of Redux time travel stuff after the first Basic Examples.

Redux marries the React concept of `"UI/View Layer being the most predictable when it is a pure function of the app state"` which has caught on in Ember and other things, along with `"state mutations in app are a pure function."`

In conclusion, it's the Reducer function which manages this immutable state concept in Redux.

---

`Dispatch` an action; that'll update state.

`Subscribe` to that state change to update the DOM.

Use `getState()` to render the current state.

---

## Very Basic Redux Examples

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
```

### Functional Programming and Time Travel

>>> **Use:** Methods that create new data instead of mutating it.

>>> **Don't use:** Destructive, mutating methods.

>>> **Why?:** Time travel.

### Time travel in Redux
This is essentially a "record and replay" feature. If all state is concatenated rather than destroyed and replaced with a new state, then state tree in a counter like this (hardware people would call it an *up counter*), then the state tree would read `0 1 2 3 4 5` ...

You can easily imagine going backwards through that time/counter array... `5 4 3 2 1 0`. That's time travel in Redux, essentially.

If you blow away your state, aka mutate it --> no time travel. How is state "recorded?" It's recorded with **Reducers.**

#### Reducers must be a pure function
... in order for time travel to be possible/easy to do. [Eric Elliott](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)

So, save the state. Use functional programming and immutable data. Here's how.


For functional programming ... don't change data, make new stuff.

| Data Type      | Use            | Don't Use  |
| ------------- |:-------------:| -----:|
| ARRAYS      | concat(), slice(), ...spread | push(), splice()  |
| OBJECTS      | Object.assign(), ...spread      |   pass by ref --> mutate |

#### About objects
[In Eric Elliott's article on Pure Functions on Medium,](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976), he describes how JavaScript function arguments are pass by value for primitives, and pass by reference for Objects. (This works similarly to the JS equality operator.) That means that any function which passes in an object and mutates that object, has `side effects` outside of the function scope; it mutates an object by reference, and that object will be referred to elsewhere. This is called an `impure function` - a pure function being the opposite.

In the tutorial, Eric uses deepClone() and deepFreeze() from lodash inside of a function. In that function, deep copies objects, and mutates (and returns) only the new, mutated copy.

The original copy is protected with deepFreeze(), outside of the scope of the function above; by doing so, we protect that object from mutation within function scope. We could also do this by hand with a reference equality.

Abramov uses the same concepts as Elliott.


## ES6 stuff

### ES6 Default Params
```
const counter = (state = 0, action)
```

- `state = 0` initializes state to initial state

- Very similar to parameter initialization in C++


## Spread operator, Object.assign, and shallow vs deep copy
There's a lot of spread operator code out there - just remember that it's [shallow copy - only a single level down a tree,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) and hence not suitable for nested data. For nested data, use `Object.assign`.

Spread operator does concatenation and a [bunch of other cool stuff.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)
