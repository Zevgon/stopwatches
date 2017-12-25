import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import {
  editModeReducer,
  rowReducer,
  colReducer,
} from './reducers';

const store = createStore(combineReducers({
  editMode: editModeReducer,
  rows: rowReducer,
  cols: colReducer,
}));

document.addEventListener('DOMContentLoaded', () => {
  const baseApp = (
    <Provider store={store} >
      <App data={JSON.parse(localStorage.getItem('savable-timer-data'))} />
    </Provider>
  );

  render(baseApp, document.getElementById('app'));
});
