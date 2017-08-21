# WebpackBin project: Learning Redux with Dan Abramov

## Start

`npm install`

`npm start`

Go to `localhost:3000`

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

#### DOM Example: 3 Redux Store methods

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


## ES6 stuff

### ES6 Default Params
```
const counter = (state = 0, action)
```

- `state = 0` initializes state to initial state

- Very similar to parameter initialization in C++
