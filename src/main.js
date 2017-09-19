import {createStore, combineReducers} from 'redux'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

// TODO app, videos 11-30

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

// Top Level Reducer
// see todoApp top level reducer in README
const todoApp = combineReducers({
  todos,
  visibilityFilter
})

/* ***** STORE ***** */
const store = createStore(todoApp)

// render() updates DOM in response to current app state
render = () => {
  ReactDOM.render(
    <TodoApp />,
    document.getElementById('root')
  )
}

// subscribe to those store changes
store.subscribe(render)

// once to render initial state
render()
