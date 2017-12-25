import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import {
  editModeReducer,
  sessionReducer,
  sessionsReducer,
} from './reducers';

const store = createStore((state = {}, action) => ({
  editMode: editModeReducer(state.editMode, action),
  session: sessionReducer(state.session, action),
  sessions: sessionsReducer(state.sessions, action, state),
}));

document.addEventListener('DOMContentLoaded', () => {
  const baseApp = (
    <Provider store={store} >
      <App data={JSON.parse(localStorage.getItem('savable-timer-data'))} />
    </Provider>
  );

  render(baseApp, document.getElementById('app'));
});
