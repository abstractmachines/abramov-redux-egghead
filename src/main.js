import {createStore} from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

// TODO app, videos 11-30

// REDUCER COMPOSITION:
// Breaking out the reducer function... into a helper function
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

/* ***** STORE and DISPATCH ***** */
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

testAddTodo()
testToggleTodo()
console.log('all tests passed!')
