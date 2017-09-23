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

// Presentational.
// List of todos.
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

// Presentational
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

// CoTodontainer
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

// Whatever we pass into Footer Component as {onFilterClick} will end up in the
// FilterLink Component as {onClick}.
const Footer = (
//   {
//   visibilityFilter,
//   onFilterClick
// }
) => {
  return (
    <div>
      <p> Show:
        {' '}
        <FilterLink filter='SHOW_ALL'
          // onClick={onFilterClick} currentFilter={visibilityFilter}
          >  ALL </FilterLink>
        {' '}
        <FilterLink filter='SHOW_ACTIVE'
          // onClick={onFilterClick} currentFilter={visibilityFilter}
          >  ACTIVE </FilterLink>
        {' '}
        <FilterLink filter='SHOW_COMPLETED'
          //  onClick={onFilterClick} currentFilter={visibilityFilter}
           >  COMPLETED </FilterLink>
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
        <VisibleTodoList />
        {/* Footer Container Component */}
        <Footer
          // visibilityFilter={visibilityFilter}
          // onFilterClick={filter =>
          //   store.dispatch({
          //     type: 'SET_VISIBILITY_FILTER',
          //     filter
          //   })
          // }
        />
      </div>
    )
  }
}

// - render() is called on every store change.
// - render() updates DOM in response to current app state.
// - current store state is: getState(), so any props passed in are from that state,
//  i.e. propName={store.getState().propName}
//
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
