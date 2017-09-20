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
