import {createStore, combineReducers} from 'redux'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

let nextTodoId = 0

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

// Container.
// Connects TodoList to the Redux store.
class VisibleTodoList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render () {
    const props = this.props
    const state = store.getState()

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id =>
          store.subscribe({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    )
  }
}

// Container.
const AddTodo = () => {
  let input

  return (
    <div>
      <input ref={node => {input = node}} />
      <button onClick={() => {
            store.dispatch({
              type: 'ADD_TODO',
              id: nextTodoId++,
              text: input.value,
            })
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
        onClick(filter);
      }}
      >
        {children}
      </a>
  );
};

// Container.
class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter ===
          state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}

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

// STORE
const store = createStore(todoApp)

//
const TodoApp = ({ store }) => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

ReactDOM.render(
  <TodoApp
  {...store.getState()}/>,
  document.getElementById('root')
)
