# Learning Redux with Dan Abramov (and Eric Elliott)
These are my notes, paraphrasing what I've learned from watching [this video series,](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree) along with some other CS concepts and things along the way.

# Table of Contents
## [Part I : Intro to Redux, Counter App](#i)
*Videos 0 - 9. See code in videos1-9.js*
1. Start, and ES6 Exports/Imports
2. Principles
3. Very basic examples (console, DOM, and React)
4. Functional Programming (FP) and Redux time travel
5. FP examples (tests!)
6. ES6 stuff
7. Why spread operator isn't always the answer for nested data

## [Part II : Moar Redux, Todo App](#ii)
*Videos 10 - 16. See code in videos10-16.js*

1. **Object.assign()** with a todo
2. Writing a Todo list **reducer** that returns a single element if called with empty array as state and ADD action.
3. Writing a reducer (toggling a todo)
4. Writing **action** with id that matches an element, adding another case to switch statement in reducer, and using the Object spread operator. (video 12)
5. **Reducer Composition Pattern:**  Covering the logic of this pattern. (video 13)
6. **Creating a Redux Store, Dispatching an Action, and Reducer Composition with Objects** (video 14)
7. Reducer Composition Pattern with **combineReducers()**... and using **Object literal shorthand notation** (video 15)
8. Skipped: writing combineReducer() from scratch (link [here](https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch))
9. Wrap up: all of code

## [Part III: React View Layer + our Reducers](#iii)
*Videos 17-30.*
1. View layer: Redux React todo (video 17).
2. Toggling a todo with onClick() action dispatching (video 18)
3. Finishing up Todos UI: Filtering todos visibility (video 19)
4. All of code so far (videos 11-19) [link](#codebeforerefactor)

## [Part IV: After the basics](#iv)
1. Refactoring: Extracting Presentational Components (video 20)


<a href='#i' id='i' class='anchor' aria-hidden='true'>Part I</a>
# Part I: Intro to Redux; Counter App

# Start

`npm install`

`npm start`

`localhost:3000`

# ES6 Exports and Imports

You will note code like the following:

`import {createStore, combineReducers} from 'redux'`

and

`import React, { Component } from 'react'`

What's that mean?

## Named and default exports

### Inline exporting
If you export something as a module with a name:

`export class SomeClass extends React.Component.....`

`export function SomeFunc ....`

These are called "named exports." What a "named export" means is that the module
has a name. In the above cases, the name is `SomeClass` or `SomeFunc`.

That seems intuitively obvious, so perhaps a better way to explain this is to talk about default exports.

`export default class SomeClass extends React.Component.....`

In the above case, `SomeClass` is exported as a **default export, and default exports
do not have to have a name. They are exported by default.**

A file can only have one default export, but it can have many named exports.

### Exporting at end of file
The above conventions name inline, i.e. "export class" and "export default class."

Let's define two things we want to export as named exports in a file:

`class oneClass extends React.Component.....`

`function oneFunc .....`

Let's export them:
`export { oneClass, oneFunc }`

That's it!

But what about if we have a default export in addition to our named exports?

`class defaultClass extends React.Component.....`

`class oneClass extends React.Component.....`

`function oneFunc .....`

`export defaultClass, { oneClass, oneFunc }`

Note the syntax, how the default export is outside of the curly braces?

Same thing with imports.

Hence, we can see that this:

`import React, { Component } from 'react'`

... imports React, a default export, and Component, a named export, from react.

That's it!


# Principles of Redux
## First Principle: All state managed in single object
This is called the state, or state tree
## Second Principle: State Tree is read-only
To change it, you must dispatch an action (a plain JS object which describes that change, in which type is the only required property).

>>> Just as state is the minimal representation of the app's data,

>>> Action is the minimal representation of changes to that data.

Usually, the action is a string because strings are serializable.

## Third Principle: A pure function takes previous state + action being dispatched to create a new state

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

# Very Basic Redux Examples

## There are 3 primary methods for the Redux store:

- store.getState()

    Gets current state of store

- store.dispatch(action)

    Dispatches an action

    Most commonly used

- store.subscribe()

   Registers a callback which is called whenever an action gets dispatched so that you can update the UI to reflect current app state (think Publish-Subscribe or Observer patterns here, which would be dependent on whether subject has a registered list of listeners or whether it's simple broadcast)


## Console Example: Dispatch action and get new state
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

## Naive DOM Example: 3 Redux Store methods

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

## DOM example: use React instead of using native DOM API

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

# Functional Programming and Redux Time Travel

>>> **Use:** Methods that create new data instead of mutating it.

>>> **Don't use:** Destructive, mutating methods.

>>> **Why?:** Time travel.

## Time travel in Redux
This is essentially a "record and replay" feature. If all state is concatenated rather than destroyed and replaced with a new state, then state tree in a counter like this (hardware people would call it an *up counter*), then the state tree would read `0 1 2 3 4 5` ...

You can easily imagine going backwards through that time/counter array... `5 4 3 2 1 0`. That's time travel in Redux, essentially.

If you blow away your state, aka mutate it --> no time travel. How is state "recorded?" It's recorded with **Reducers.**

## Reducers must be a pure function
... in order for time travel to be possible/easy to do. [Eric Elliott](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)

So, save the state. Use functional programming and immutable data. Here's how.


For functional programming ... don't change data, make new stuff.

| Data Type      | Use            | Don't Use  |
| ------------- |:-------------:| -----:|
| ARRAYS      | concat(), slice(), ...spread | push(), splice()  |
| OBJECTS      | Object.assign(), ...spread      |   pass by ref --> mutate |

## About objects
[In Eric Elliott's article on Pure Functions on Medium,](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976), he describes how JavaScript function arguments are pass by value for primitives, and pass by reference for Objects. (This works similarly to the JS equality operator.) That means that any function which passes in an object and mutates that object, has `side effects` outside of the function scope; it mutates an object by reference, and that object will be referred to elsewhere. This is called an `impure function` - a pure function being the opposite.

In the tutorial, Eric uses deepClone() and deepFreeze() from lodash inside of a function. In that function, deep copies objects, and mutates (and returns) only the new, mutated copy.

The original copy is protected with deepFreeze(), outside of the scope of the function above; by doing so, we protect that object from mutation within function scope. We could also do this by hand with a reference equality.

Abramov uses the same concepts as Elliott.

## FP examples (tests!)
With the Expect library and deepFreeze, we emulate with Abramov what we did in the Elliott tutorial.

Here are some tests.


Test: Add states to counter


```
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
```

Test: remove states from counter

```
const rmvCounter = (list) => {
  return list.slice(1)
}

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
```

Test: remove particular items out of states

this will (kinda) illustrate why we have time travel in Redux

```
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
```

Test: increment the counter

```
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
```

# ES6 stuff

## ES6 Default Params
```
const counter = (state = 0, action)
```

- `state = 0` initializes state to initial state

- Very similar to parameter initialization in C++


<a href='#ii' id='ii' class='anchor' aria-hidden='true'>Part II</a>
# Part II: Moar Redux, and the Todo app

## Spread operator, Object.assign, and shallow vs deep copy
There's a lot of spread operator code out there - just remember that it's [shallow copy - only a single level down a tree,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) and hence not suitable for nested data. For nested data, use `Object.assign`.

Spread operator does concatenation and a [bunch of other cool stuff.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)

>>> Object.assign is in ES6 standard

## Object.assign() syntax
```
Object.assign( {}, source, source, source)
```
The first argument in Object.assign() is the empty `target object` that everything else that is a param will be copied into (i.e., all other params are considered 'sources'). The first param is an empty object so that we can ensure that we do not overwrite any existing data; we are creating/returning a new object.

Object.assign() is in the ES6 standard. You need to use Babel, another polyfill, or just use the Object spread operator for ES7. It's enabled in Babel in the stage 2 preset.

## Example (video 11): Using Object.assign() with a todo:
*Inconsistent semicolons here, Dan uses them a lot, and I didn't remove them all*

```
const toggleTodo = (todo) => {
  // Option 1: mutate the todo object and cause trouble!
  // todo.completed = !todo.completed
  // return todo
  // Option 2: instead of mutating existing data, create new data:
  return Object.assign({}, todo, {completed: !todo.completed})
};

const testToggleToDo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };
  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };

  deepFreeze(todoBefore)

  expect(
    toggleTodo(todoBefore)
  ).toEqual(todoAfter)
};

testToggleToDo()
console.log('tested todo!')
```

## Example (video 11): Writing a Todo list reducer (toggling a todo)
- When reducer is called with empty array as state, and an `ADD_TODO` action, it returns an array with a single TODO element.

```
// reducer.
const todos = (state = [], action) => {
  // action type is a string. when it matches, returns...
  switch(action.type) {
    case 'ADD_TODO':
    return [
      // all items from original array,
      ...state,
      // and, new item.
      {
        id: action.id,
        text: action.text,
        completed: false
      }
    ];
    // reducers always return current state for any unknown action.
    default:
      return state;
  }
};

// add an action, and test that code is correct.
const testAddTodo = () => {
  const stateBefore = []
  const action = { // action
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  }
  const stateAfter = [{ // state
    id: 0,
    text: 'Learn Redux',
    completed: false
  }]

  deepFreeze(stateBefore)
  deepFreeze(action)

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter)
}

testAddTodo()
console.log('all tests passed!')
```

## Example (video 12): Writing an action that toggles element with matching id. Use Object spread operator

```
// add an action that toggles completed status of element
// with same ID as action.
const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Play synthesizers',
      completed: false
    }
  ]
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  }
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Play synthesizers',
      completed: true
    }
  ]
  deepFreeze(stateBefore)
  deepFreeze(action)

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter)
}
```

and add in this case for the switch statement for reducer:
```
case 'TOGGLE_TODO':
return state.map(todo => {
  if (todo.id !== action.id) {
    return todo;
  }
  return {
    ...todo, // Object spread operator
    completed: !todo.completed
  }
})
```

## Example: Reducer Composition Pattern with arrays (video 13)

### Reducer Composition Pattern:

- Breaking reducer down into multiple functions (single responsibility principle)
- Combine those reducers together.
- Top level reducer calls existing "child" reducers and combines their results in a single state object.
- State is undefined/an empty object on the top level reducer. Initial state is an empty object, so fields are undefined. Child reducers will return initial state, and populates state object for the first time.
- Actions come in and update state with the part of state that they manage.
>>> **Motivation:** A function that does more than 1 thing is often hard to understand. Use the single responsibility principle (SOLID, more).

- How is the todos array updated?
- How are individual todos updated?
Answer: break your reducer apart so these questions are easier to answer.


## Use Multiple Reducers, separate responsibilities

**Top level Reducer function invokes the other reducer function for each case:**

- `state` refers to list of todo's.
- This is the `top level reducer`.

```
// REDUCER: `state` refers to list of todos
const todos = (state = [], action) => {
  // action type is a string. when it matches, returns...
  switch(action.type) {
    case 'ADD_TODO':
    return [
      ...state,
      todo(undefined, action)
    ];
    case 'TOGGLE_TODO':
    return state.map(t => todo(t, action))
    // reducers always return current state for any unknown action.
    default:
      return state;
  }
};
```

**Child Reducer function: create and update todo's in response to action:**

- `state` refers to individual todo, instead of list of todo's.
- Replace `todo.property` with `state.property`

```
const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state, // Object spread operator
        completed: !state.completed
      };
    default:
      return state
  }
}
```

## Creating a Redux Store, Dispatching an Action (video 14)

If we create a Redux store here after we've written our reducer function(s), we can see how things work under the hood a little bit.

// Your Reducers...

Create Store:
```
// create a store and check its initial state...
const store = createStore(todos)
console.log('initial state:')
console.log(store.getState()) // initially, just an empty array...
console.log('----------------')
```

Dispatch an action to add a new TODO. Since the reducer assigns completed to false, it'll add a single todo with completed: false.
```
// video 14: create a store and check its initial state...
const store = createStore(todos)
console.log('initial state:')
console.log(store.getState()) // initially, just an empty array...
console.log('----------------')

// dispatch an action to add a new todo. It will have completed: false
console.log('Dispatching ADD_TODO.')
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Play synthesizers'
})
// this will show one object, id 1, text: play synthesizers, completed: false
console.log('current state:')
console.log(store.getState())

// Play them synths!
console.log('Dispatching TOGGLE_TODO. Play them synths! Completed true!')
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 1,
  text: 'Play synthesizers'
})
// same object, but completed: true. Because you played synths.
console.log('current state:')
console.log(store.getState())
```

Cool!

## Reducer Composition Pattern with Objects (video 14)

This section will describe the logic of this pattern, and we will work through it with code.

Later, we will replace this with `combineReducers`.
> DanUp until this point we've represented the whole state of the application as an array of todos. This works for a simple example. But what if we want to store more information? Such as filtering visibility of completed items?

For that, we can create a new top level reducer that invokes the other reducers.

```
// REDUCER: todo
// `state` refers to individual todo, instead of list of todo's.
// Creating and updating a todo in response to an action:
const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state, // Object spread operator
        completed: !state.completed
      };
    default:
      return state
  }
}

// REDUCER: todos
// `state` refers to list of todos
const todos = (state = [], action) => {
  // action type is a string. when it matches, returns...
  switch(action.type) {
    case 'ADD_TODO':
    return [
      ...state,
      todo(undefined, action)
    ];
    case 'TOGGLE_TODO':
    return state.map(t => todo(t, action))
    // reducers always return current state for any unknown action.
    default:
      return state;
  }
};

// Top level REDUCER: visibilityFilter
// state of visibilityFilter is a string representing current filter;
// it is changed by SET_VISIBILITY_FILTER action.
const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

// Top Level Reducer: Combining Reducers
// - To store this information (visibility), no need to change existing reducers.
//  Use reducer composition: create a new reducer that calls the existing reducers,
//  to manage parts of its state, and combines their results in a single new state object.
// - Since it invokes other reducers, it's higher level, and hence, initial state is
//  not defined. Child reducers todos and todo will populate the state.
const todoApp = (state = {}, action) => {
  return {
    todos: todos(
      state.todos,
      action
    ),
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  }
}

/* ***** STORE and DISPATCH has Top Level Reducer ***** */
const store = createStore(todoApp)
// all the other dispatch stuff, same as before
```

## Reducer Composition Pattern with combineReducer() (video 15)

**combineReducers:** The keys of the combineReducers object will match with the
fields of the state object that combineReducers will manage.

`import {createStore, combineReducers} from 'redux'`

Then, replace this:
```
const todoApp = (state = {}, action) => {
  return {
    todos: todos(
      state.todos,
      action
    ),
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  }
}
```
With this:
```
const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
})
```

With ES6's `Object literal shorthand notation`, we can make it even more succinct.
Since the key names and the value names are the same, values can be omitted.
```
const todoApp = combineReducers({
  todos,
  visibilityFilter
})
```

## Writing combineReducer() from scratch
- Skipped for now
- Link [here](https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch)

## Part II Wrap up: Code
see videos10-16.js for full code example.


<a href='#iii' id='iii' class='anchor' aria-hidden='true'>Part III</a>
# Part III: React View layer for our Redux Reducers

## Todos: adding React Components to our reducers  (video 17)
- Install these with npm.

- Import them.

### Code (and, an explanation of how it works)

What this section will create:

![video 17](https://github.com/abstractmachines/abramov-redux-egghead/blob/master/abramov-video17.gif)

- Reducers here. Same as before.

- Create Store:
```
const store = createStore(todoApp)
```

- Create global todo id that you increment with each dispatch:
```
let nextTodoId = 0 // global. increment.
```

- Create a typical React Component class... for event handling, dispatch an action!

- It's common for React components to **dispatch actions**;
- and, to **render** collections with `map()`:
```
class TodoApp extends Component {
  render() {
    return (
      <div>
        <input ref={node => {this.input = node}} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          })
          this.input.value = ''
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo =>
            <li key={todo.id}>
              {todo.text}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

- render() is called on every store change. (We are not yet working with lifecycle methods.)
- render() updates DOM in response to current app state.
- current store state is: getState(),
- and todos are an array that Redux gets from current state of store.
const render = () => {
```
const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos}/>,
    document.getElementById('root')
  )
}
```


- Subscribe to those store changes.
```
store.subscribe(render)
```

- Invoke render() once, to render initial state.
```
render()
```

**How mutation works in Redux:**

- Any state change is caused by a dispatch() call.

- When an action is dispatched, the store calls the reducer that the store was created with,

- with the current state, and the action being dispatched.

- with combined reducers, state is undefined because there will be no NEW state ... yet.

The CHILD reducer (the one you're invoking) will call that.

- the ROOT reducer is the one the store is created with.

## Todos: toggling a todo with React + Redux (video 18)

Here is what this code will accomplish:

![video 18](https://github.com/abstractmachines/abramov-redux-egghead/blob/master/abramov-video18-toggle.gif)

To toggle, we will use `onClick` event handlers, and we will dispatch an action
inside of that todo!

To show toggled (line-through for done), we just use the `style attribute` and
`text-decoration` property!

Here's the `<li>` within our rendered React Component:

```
<ul>
  {this.props.todos.map(todo =>
    <li key={todo.id}
      onClick={() => {
        store.dispatch({
          type: 'TOGGLE_TODO',
          id: todo.id
        })
      }}
      style={{ textDecoration: todo.completed ? 'line-through' : 'none'}}
      >
      {todo.text}
    </li>
  )}
</ul>
```


## Finishing up Todos UI: Filtering todos visibility (video 19)

We want to filter visibility of todos in categories such as :

- completed todos
- active todos
- all todos

Here is what this code will accomplish:

![video 18](https://github.com/abstractmachines/abramov-redux-egghead/blob/master/abramov-video19-filter-toggle.gif)


#### How it works:
- `todoApp` is a top-level reducer which combines (invokes) `todos` reducer
  and `visibilityFilter` reducer.

- the two reducers mentioned above are passed into the Component as props.
```
const render = () => {
  ReactDOM.render(
    <TodoApp
    todos={store.getState().todos} visibilityFilter={store.getState().visibilityFilter}
    />,
    document.getElementById('root')
  )
}
```


- It starts with Component **FilterLink**: a `dispatch call` with an `action` of the type `SET_VISIBILITY_FILTER`.

```
const FilterLink = ({
  filter,
  children,
  currentFilter
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter // pass in filter prop, so we know which filter is clicked
        });
      }}
      >
        {children} {/* text of the link */}
      </a>
  );
};
```

- It passes filter, which is a prop, to the link component, so every one of
those 3 links is going to have a different filter prop.
```
<p> Show:
  {' '}
  <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>  ALL </FilterLink>
  {' '}
  <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>  ACTIVE </FilterLink>
  {' '}
  <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>  COMPLETED </FilterLink>
</p>
```

- the store `dispatch function` will call our `root reducer` (aka `top level
reducer`) with a state and action,
```
const store = createStore(todoApp)
```

- which, in turn, will call the `visibilityFilter reducer` with a part of the
state and the action. When action type is set to `SET_VISIBILITY_FILTER`, it
just returns `action.filter` as next state value for the visibility reducer.
It doesn't care about previous state in that case.
```
const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}
```

- the root reducer will use this new field as part of its new state object

- the render function is subscribed to store changes, so it will get that new
state object and will pass all of its **keys** as **props** to Todoapp
Component.
```
const render = () => {
  ReactDOM.render(
    <TodoApp
    todos={store.getState().todos} visibilityFilter={store.getState().visibilityFilter}
    />,
    document.getElementById('root')
  )
}
```

- Both of those props are passed to the `getVisibleTodos` function, which
calculates what's visible based on incoming action type, using a switch and filter()
using the action type string.
Return value is the array of visible todo's. It's used in the render() function to
enumerate over the visible/filtered todos.
```
const getVisibleTodos = (
  todos,
  filter
) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}
```

- visibilityFilter field is also used by `FilterLink` for rendering active links
based on whether the `filter === currentFilter.`

- For styling of completed/active items, use a `style` attribute (prop)

- For styling of active links:

 -  pass down the `visibilityFilter` prop to every link in the FilterLink Component.

 - pass in the `currentFilter` prop to every link in the FilterLink Component.

 - Inside that FilterLink Component, add a conditional: If filter is currentFilter (if it matches), render a span (unclickable) instead of a link.

#### Optimizations:
**In the render function, replace specific passing in of props:**
```
const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos} visibilityFilter={store.getState().visibilityFilter}/>,
    document.getElementById('root')
  )
}
```
with spread operator:
```
const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()}/>,
    document.getElementById('root')
  )
}
```

**Destructure your Component props to make your Component code more succinct.**

Instead of using code like this:
```
this.props.todos,
this.props.visibilityFilter
```
everywhere,

instead, just inside of the `render()` function of your Component,
use ES6 destructuring for your props. As such:
```
const {
  todos,
  visibilityFilter
} = this.props
```

Remember that this is the "ES6 equivalent" of:
```
const todos = this.props.todos
const visibilityFilter = this.props.visibilityFilter
```
<a href='#codebeforerefactor' id='codebeforerefactor' class='anchor' aria-hidden='true'>Code before refactor</a>
### All the code so far: Videos 11-19
```
import {createStore, combineReducers} from 'redux'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

// TODO app, videos 11-19

// REDUCER: todo
// `state` refers to individual todo, instead of list of todo's.
// Creating and updating a todo in response to an action:
const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state, // Object spread operator
        completed: !state.completed
      };
    default:
      return state
  }
}

// REDUCER: todos
// `state` refers to list of todos
const todos = (state = [], action) => {
  // action type is a string. when it matches, returns...
  switch(action.type) {
    case 'ADD_TODO':
    return [
      ...state,
      todo(undefined, action)
    ];
    case 'TOGGLE_TODO':
    return state.map(t => todo(t, action))
    // reducers always return current state for any unknown action.
    default:
      return state;
  }
};

// - Top level REDUCER: visibilityFilter
// - Returns `action.filter` as next state value for the visibility reducer
//  IF action param is SET_VISIBILITY_FILTER. ELSE, returns current state.
const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

// Top Level Reducer "Root Reducer"
// see todoApp top level reducer in README
const todoApp = combineReducers({
  todos,
  visibilityFilter
})

/* ***** STORE ***** */
const store = createStore(todoApp)

/**
 * User needs to click this to switch current visible todos.
 * filter prop is just a string
 * children is the contents of the link
 * @param {Component} class [description]
 */
const FilterLink = ({
  filter,
  children,
  currentFilter
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter // pass in filter prop, so we know which filter is clicked
        });
      }}
      >
        {children} {/* text of the link */}
      </a>
  );
};

// Switch current filter value.
// Returns array of visible todo's.
const getVisibleTodos = (
  todos,
  filter
) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

let nextTodoId = 0 // global. increment.

// TODO: wrap the <input> in a <form> so both enter and click work for button submit
//  This was causing some rendering issues in React.
class TodoApp extends Component {
  render() {
    const {
      todos,
      visibilityFilter
    } = this.props
    // filter todos before rendering them:
    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    );
    return (
      <div>
        <input ref={node => {this.input = node}} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          })
          this.input.value = ''
        }}>
          Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo =>
            <li key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                })
              }}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none'}}
              >
              {todo.text}
            </li>
          )}
        </ul>
        <p> Show:
          {' '}
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>  ALL </FilterLink>
          {' '}
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>  ACTIVE </FilterLink>
          {' '}
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>  COMPLETED </FilterLink>
        </p>
      </div>
    )
  }
}

// - render() is called on every store change.
// - render() updates DOM in response to current app state.
// - current store state is: getState(), so any props passed in are from that state,
//  i.e. propName={store.getState().propName}
const render = () => {
  ReactDOM.render(
    <TodoApp
    {...store.getState()}/>,
    document.getElementById('root')
  )
}

// subscribe to those store changes
store.subscribe(render)

// once, to render initial state
render()
```

<a href='#iv' id='iv' class='anchor' aria-hidden='true'>Part IV</a>
## Refactoring: Extracting Presentational Components: Todo, TodoList (videos 20, 21)
A single component approach has worked so far, but we want to build modular code that is more testable and maintainable, and has separation of responsibility and concerns.

We want to separate Containers, or Smart Components, from Presentational, or
Dumb Components. Presentational Dumb Components only care about the presentation,
and so all the behavior should be removed from Dumb Components.

**Things we will remove to make a Component a Presentational (Dumb) Component:**

- **key:** The component will present a single todo item, so we will remove the `key`.
(We'll use that later when iterating over the collection.)

- **onClick:** We will remove the onClick handler, and promote it to be a prop.

- **Explicit props:** Instead of passing a todo object, we pass completed and text as explicit props.

We add these presentational components:
```
// Single todo element
// A presentational component.
// Instead of passing a todo object, we pass completed and text as explicit props.
const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{textDecoration: completed ? 'line-through' : 'none'}}
    >
    {text}
  </li>
)

// List of todos.
// A presentational component.
// Accepts array of todos, and iterates over them.
const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo} // equivalent to: text={todo.text} completed={todo.completed}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)
```

and now our Todoapp Component, will contain a Container (Smart) Component:
```
{/* TodoList Container (Smart) Component */}
<TodoList
  todos={visibleTodos}
  onTodoClick={id =>
    store.dispatch({
      type: 'TOGGLE_TODO',
      id
    })
  }
/>
```

## Refactoring: Extracting Presentational Components: AddTodo (video 21)

Extract input and button into separate presentational components called AddTodo. AddTodo will be a functional component (with the requisite  <AddTodo /> replacing it inside TodoApp.)

Extracted Presentational (Dumb) Component: AddTodo
```
const AddTodo = ({
  addTodoClick
}) => {
  let input // functional components = no this; declare locally; let mutate (no const)

  return (
    <div>
      <input ref={node => {input = node}} />
      <button onClick={() => {
        addTodoClick(input.value)
        input.value = ''
      }}>
        Add Todo
      </button>
    </div>
  )
}
```

Container (Smart) Component: AddTodo
```
<AddTodo
  addTodoClick={text =>
    {
      store.dispatch({
        type: 'ADD_TODO',
        text,
        id: nextTodoId++
      })
    }
  }
/>
```

## Refactoring: Extracting Presentational Components: Footer, FilterLink (video 21)
This one was a little different because of some of the complexity involved.

Whatever we pass into Footer Component as ``{onFilterClick}`` will end up in the
FilterLink Component as `{onClick}`.
- The Smart Container Component `<TodoApp>` passes in `onFilterClick` as a prop to
`<Footer>` (and dispatches an action as described above in FilterLink docs).
- `<Footer>` receives that `onFilterClick` prop passed into it, and assigns it
to `onClick` inside of the `<FilterLink>` component;
- Hence, it's logical that `<FilterLink>` will receive that `onClick` prop, from
when it was invoked inside of `<Footer>.`


Extracted Presentational (Dumb) Components: Footer and FilterLink
```
// whatever we pass into Footer Component as {onFilterClick} will end up in the
// FilterLink Component as {onClick}.
const Footer = ({
  visibilityFilter,
  onFilterClick
}) => {
  return (
    <div>
      <p> Show:
        {' '}
        <FilterLink filter='SHOW_ALL' onClick={onFilterClick} currentFilter={visibilityFilter}>  ALL </FilterLink>
        {' '}
        <FilterLink filter='SHOW_ACTIVE' onClick={onFilterClick} currentFilter={visibilityFilter}>  ACTIVE </FilterLink>
        {' '}
        <FilterLink filter='SHOW_COMPLETED' onClick={onFilterClick} currentFilter={visibilityFilter}>  COMPLETED </FilterLink>
      </p>
    </div>
  )
}

const FilterLink = ({
  filter,
  children,
  currentFilter,
  onClick
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick(filter);
      }}
      >
        {children} {/* text of the link */}
      </a>
  );
};
```
Container (Smart) Component: Footer
```
{/* Footer Container Component */}
<Footer visibilityFilter={visibilityFilter}
  onFilterClick={filter =>
    store.dispatch({
      type: 'SET_VISIBILITY_FILTER',
      filter
    })
  }
/>
```

## Refactoring: Converting TodoApp into a function (video 21)
This should be done whenever possible.

- Instead of declaring the props inside the render method, do it in the argument.
- Hence, you can remove the props destructuring.
- Remove the render() method declaration.

## Videos 22/23 revert much of the refactoring code in vids 20-21
The code above was functional, but in video 22, much of this work is redone.

The code below will have the following improvements.

### Encapsulation:
The parent components won't need to know so much about data/stuff children components need.

### More efficient subscriptions/updates to store changes:

#### Use lifecycle methods in each component:
Render() re-renders entire app on store changes, and is expensive, non-ideal.

### Change as many classes as possible to Functional Components


## Code for videos 20-21:
```
import {createStore, combineReducers} from 'redux'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

let nextTodoId = 0

// REDUCER: todo
// `state` refers to individual todo, instead of list of todo's.
// Creating and updating a todo in response to an action:
const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state, // Object spread operator
        completed: !state.completed
      };
    default:
      return state
  }
}

// REDUCER: todos
// `state` refers to list of todos
const todos = (state = [], action) => {
  // action type is a string. when it matches, returns...
  switch(action.type) {
    case 'ADD_TODO':
    return [
      ...state,
      todo(undefined, action)
    ];
    case 'TOGGLE_TODO':
    return state.map(t => todo(t, action))
    // reducers always return current state for any unknown action.
    default:
      return state;
  }
};

// - Top level REDUCER: visibilityFilter
// - Returns `action.filter` as next state value for the visibility reducer
//  IF action param is SET_VISIBILITY_FILTER. ELSE, returns current state.
const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

// Top Level Reducer / Root Reducer
const todoApp = combineReducers({
  todos,
  visibilityFilter
})

// STORE
const store = createStore(todoApp)

// Single todo element
// A presentational component.
// Instead of passing a todo object, we pass completed and text as explicit props.
const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{textDecoration: completed ? 'line-through' : 'none'}}
    >
    {text}
  </li>
)

// List of todos.
// A presentational component.
// Accepts array of todos, and iterates over them.
const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo} // equivalent to: text={todo.text} completed={todo.completed}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

// button and input presentational component.
// Functional component that does not accept any props.
const AddTodo = ({
  addTodoClick
}) => {
  let input // functional components = no this; declare locally; let mutate

  return (
    <div>
      <input ref={node => {input = node}} />
      <button onClick={() => {
        addTodoClick(input.value)
        input.value = ''
      }}>
        Add Todo
      </button>
    </div>
  )
}

// Switch current filter value. Returns array of visible todo's.
const getVisibleTodos = (
  todos,
  filter
) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

// User needs to click this to switch current visible todos.
// Children is the contents of the link.
const FilterLink = ({
  filter,
  children,
  currentFilter,
  onClick
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick(filter);
      }}
      >
        {children}
      </a>
  );
};

// Whatever we pass into Footer Component as {onFilterClick} will end up in the
// FilterLink Component as {onClick}.
const Footer = ({
  visibilityFilter,
  onFilterClick
}) => {
  return (
    <div>
      <p> Show:
        {' '}
        <FilterLink filter='SHOW_ALL' onClick={onFilterClick} currentFilter={visibilityFilter}>  ALL </FilterLink>
        {' '}
        <FilterLink filter='SHOW_ACTIVE' onClick={onFilterClick} currentFilter={visibilityFilter}>  ACTIVE </FilterLink>
        {' '}
        <FilterLink filter='SHOW_COMPLETED' onClick={onFilterClick} currentFilter={visibilityFilter}>  COMPLETED </FilterLink>
      </p>
    </div>
  )
}

class TodoApp extends Component {
  render() {
    const {
      todos,
      visibilityFilter
    } = this.props
    // filter todos before rendering them:
    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    );
    return (
      <div>
        {/* AddTodo  Container Component */}
        <AddTodo
          addTodoClick={text =>
            {
              store.dispatch({
                type: 'ADD_TODO',
                text,
                id: nextTodoId++
              })
            }
          }
        />
        {/* TodoList Container Component */}
        <TodoList
          todos={visibleTodos}
          onTodoClick={id =>
            store.dispatch({
              type: 'TOGGLE_TODO',
              id
            })
          }
        />
        {/* Footer Container Component */}
        <Footer visibilityFilter={visibilityFilter}
          onFilterClick={filter =>
            store.dispatch({
              type: 'SET_VISIBILITY_FILTER',
              filter
            })
          }
        />
      </div>
    )
  }
}

// - render() is called on every store change.
// - render() updates DOM in response to current app state.
// - current store state is: getState(), so any props passed in are from that state,
//  i.e. propName={store.getState().propName}
const render = () => {
  ReactDOM.render(
    <TodoApp
    {...store.getState()}/>,
    document.getElementById('root')
  )
}

// subscribe to those store changes
store.subscribe(render)

// once, to render initial state
render()
```

## Code after videos 22:

At this point after extracting components and toying with the code, and getting
the code to work at the end of every video, things broken down a bit.

The discussion on the [tutorial page here](https://egghead.io/lessons/javascript-redux-extracting-container-components-filterlink) indicates that:

>>> "This tutorial is just an approximation of how connect() from React Redux works.
Please watch series to the end, which is where we start using it and remove the “wrong” code.""

and

>>> "The FilterLink component in this lesson is not following the rules in React.
This error is removed in later chapters and is not the way things are done in Redux,
so it is just confusing. [the error is] render() depends on something else than
this.state or this.props which is simply illegal in React."

>>> "The contract of a a react component is that the result returned from render
should only depend on this.state and this.props and nothing else."
[React Component Spec](https://facebook.github.io/react/docs/react-component.html)
- **"The proper way to do this is to use this.state instead. This is done by reading the value from store.getState() in the subscribe listener and call this.setState() of the component."**

... So .... that's why the code doesn't really work here in video 22.
The error is:

>>> filter is not defined
    at onClick (main.js?

>>>>>>>>>>>>>>>>>>>>>>>>
