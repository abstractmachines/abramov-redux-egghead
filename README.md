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
2. Rad
3. Stuff

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

- Breaking reducer down into multiple functions (single r
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

## Todos: toggling a todo with React + Redux

Here is what this code will accomplish:

![video 18](https://github.com/abstractmachines/abramov-redux-egghead/blob/master/abramov-video18-toggle.gif)

To toggle, we will use `onClick` event handlers, and we will dispatch an action
inside of that todo!

To show toggled (line-through for done), we just use the `style attribute` and
`text-decoration` property!

Here's the `<li>` within our rendered React Component:

```
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
```
