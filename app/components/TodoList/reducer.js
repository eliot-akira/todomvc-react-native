/*
 *
 * TodoList reducer
 *
 */

import { fromJS } from 'immutable';
import {
  TOGGLE_TASK_COMPLETION_REQUEST,
  TOGGLE_TASK_COMPLETION_SUCCESS,
  TOGGLE_TASK_COMPLETION_ERROR,
  ADD_TASK_REQUEST,
  ADD_TASK_ERROR,
  ADD_TASK_SUCCESS,
  DELETE_TASK_REQUEST,
  LOAD_TASKS_SUCCESS,
  LOAD_TASKS_ERROR,
} from './constants';

const initialState = fromJS({
  error: null,
  items: [],
});

const updateTodoItem = (state, id, predicate) => {
  return state.updateIn(['items'], items => {
    const itemIndex = items.findIndex( i => i.get('id') === id);
    if (itemIndex !== -1) {
      return items.update(itemIndex, i => predicate(i));
    }
    return items;
  });
};

function todos(state = initialState, action) {
  switch (action.type) {
    case LOAD_TASKS_ERROR:
      return state.set('error', action.payload.error);

    case LOAD_TASKS_SUCCESS:
      return state.set('items', fromJS(action.payload.todos)).set('error', null);

    case TOGGLE_TASK_COMPLETION_REQUEST:
      return updateTodoItem(state, action.payload.id, (item) => {
        return item.updateIn(['isComplete'], ic => !ic).set('isDisabled', true);
      });

    case TOGGLE_TASK_COMPLETION_SUCCESS:
      return updateTodoItem(state, action.payload.id, (item) => {
        return item.set('isDisabled', false);
      });

    case ADD_TASK_REQUEST:
      return state.updateIn(['items'], items => {
        return items.push(fromJS(action.payload));
      });

    case ADD_TASK_SUCCESS:
      return updateTodoItem(state, action.payload.clientId, (item) => {
        return item.set('id', action.payload.todo.id).set('isDisabled', false);
      });

    case TOGGLE_TASK_COMPLETION_ERROR:
    case ADD_TASK_ERROR:
      return updateTodoItem(state, action.payload.id, (item) => {
        return item.set('error', 'Oops. Something went wrong.').set('isDisabled', false);
      });

    case DELETE_TASK_REQUEST:
      return state.updateIn(['items'], items => {
        return items.filter(todo => todo.get('id') !== action.payload.id);
      });

    default:
      return state;
  }
}

export default todos;

export function selectAllTodos(state) {
  return state.get('todos').get('items');
}

export function selectCompletedTodos(state) {
  return state.get('todos').get('items').filter(todo => todo.get('isComplete'));
}

export function selectActiveTodos(state) {
  return state.get('todos').get('items').filter(todo => !todo.get('isComplete'));
}
