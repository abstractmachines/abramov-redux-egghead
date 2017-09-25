import {createStore, combineReducers} from 'redux'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

let nextTodoId = 0

/* ***** Action Creators ***** ***** */
// These take arguments about the action.
// These return the action object.
// Action creators document your software: what actions components can dispatch.
// Instead of dispatching inline.

const addTodoActionCreator = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
}

const setVisibilityFilterActionCreator = (filter) => {
  return {
      type: 'SET_VISIBILITY_FILTER',
      filter: filter
    }
}

const toggleTodoActionCreator = (id) => {
  return {
      type: 'TOGGLE_TODO',
      id
  }
}

/* ***** Components and Reducers ***** ***** */

/* ***** Reducers ***** ***** */

// REDUCER
// `state` refers to individual todo.
// Creates, updates todo in response to an action.
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
        ...state,
        completed: !state.completed
      };
    default:
      return state
  }
}

// REDUCER
// `state` refers to list of todos.
const todos = (state = [], action) => {
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

// REDUCER
// - Returns `action.filter` as next state value for the visibility reducer,
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

// REDUCER
// Top Level Reducer / Root Reducer
const todoApp = combineReducers({
  todos,
  visibilityFilter
})

/* ***** Components ***** ***** */

// Presentational.
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

// Presentational.
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

// Maps state of Redux store to the props of the TodoList components.
// Takes in state of Redux store.
// Returns props to pass to Presentational TodoList component to render it with current state.
const mapStateToPropsTodoList = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  }
}

// Maps dispatch method of store to callback props of TodoList component.
// Returns props to be passed to TodoList component
const mapDispatchToPropsTodoList = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodoActionCreator(id))
    }
  }
}

// Container. Generated.
// Connects TodoList to the Redux store.
const VisibleTodoList = connect(
  mapStateToPropsTodoList,
  mapDispatchToPropsTodoList
)(TodoList)


// Container.
let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <input ref={node => {input = node}} />
      <button onClick={() => {
            dispatch(addTodoActionCreator(input.value))
        input.value = ''
      }}>
        Add Todo
      </button>
    </div>
  )
}

// AddTodo doesn't need to subscribe to the whole store. It just needs { dispatch } injected.
// mapState to props is first arg of connect, but AddTodo has no props depending on state.
// mapDispatchToProps is 2nd arg, BUT AddTodo doesn't need callback props, it just
// accepts dispatch function; dispatch of connect is automagically injected if 2nd arg null.
// AddTodo = connect( null, null )(AddTodo) is equivalent to:
AddTodo = connect()(AddTodo)

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

// Presentational.
const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick(active);
      }}
      >
        {children}
      </a>
  );
};

const mapStateToPropsLink = (
  state,
  ownProps
  // Since it's common to use Container props when calculating child props,
  // we name child props = ownProps.
) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToPropsLink = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(
        setVisibilityFilterActionCreator(ownProps.filter)
      )
    }
  }
}

const FilterLink = connect(
  mapStateToPropsLink,
  mapDispatchToPropsLink
)(Link) // FilterLink renders Link


// Presentational.
const Footer = () => {
  return (
    <div>
      <p> Show:
        {' '} <FilterLink filter='SHOW_ALL'>  ALL </FilterLink>
        {' '} <FilterLink filter='SHOW_ACTIVE'>  ACTIVE </FilterLink>
        {' '} <FilterLink filter='SHOW_COMPLETED'>  COMPLETED </FilterLink>
      </p>
    </div>
  )
}

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)
