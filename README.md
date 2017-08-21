# WebpackBin project: Learning Redux with Dan Abramov

## Start

`npm install`

`npm start`

Go to `localhost:3000`

## Working Redux Examples

There are 3 primary methods for the Redux store:

- store.getState()

 Gets current state of store

- store.dispatch(action)

 Dispatches an action

 Most commonly used

- store.subscribe()

 Registers a callback which is called whenever an action gets dispatched so that you can update the UI to reflect current app state (think Publish-Subscribe or Observer patterns here, which would be dependent on whether subject has a registered list of listeners or whether it's simple broadcast)


#### Console Example: Dispatch and getState
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

const store = createStore(counter);

console.log(store.getState()); // 0

store.dispatch({ type: 'INCREMENT' })

console.log(store.getState()); // 1
```
