import { cloneDeep } from 'lodash';
import {
  TOGGLE_EDIT_MODE,
  RECEIVE_DATA,
  CREATE_NEW_ROW,
  CREATE_NEW_COL,
  RECEIVE_STOPWATCH_TIME,
  RECEIVE_STOPWATCH_NAME,
  DELETE_ROW,
  RECEIVE_STOPWATCH_TYPE,
  RECEIVE_SESSION,
  CREATE_NEW_SESSION,
} from './constants';
import {
  createColumn,
  createRow,
  createDefaultSession,
} from './utils';


export const editModeReducer = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_EDIT_MODE:
      return !state;
    default:
      return state;
  }
};

export const rowReducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return cloneDeep(action.data.rows);
    case CREATE_NEW_ROW:
      return cloneDeep(state).concat([createRow(action.numStopwatchCols, 'Stopwatch name')]);
    case CREATE_NEW_COL:
      return state.map(row => ({
        [`col-${action.numCols}`]: 0,
        ...row,
      }));
    case RECEIVE_STOPWATCH_TIME: {
      const newRows = cloneDeep(state);
      newRows[action.rowIdx][action.colId] = action.newTime;
      return newRows;
    }
    case RECEIVE_STOPWATCH_NAME: {
      const newRows = cloneDeep(state);
      newRows[action.rowIdx].name = action.newName;
      return newRows;
    }
    case DELETE_ROW: {
      const newRows = cloneDeep(state);
      if (newRows.length === 1) return state;
      return newRows.slice(0, action.rowIdx).concat(newRows.slice(action.rowIdx + 1));
    }
    default:
      return state;
  }
};

export const colReducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return cloneDeep(action.data.columns);
    case CREATE_NEW_COL: {
      const newColumn = createColumn('Stopwatch Type', action.numCols, action.onStopwatchChange);
      return state.concat([newColumn]);
    }
    case RECEIVE_STOPWATCH_TYPE: {
      const newCols = cloneDeep(state);
      const { colIdx, newType } = action;
      newCols[colIdx] = createColumn(newType, colIdx);
      return newCols;
    }
    default:
      return state;
  }
};

export const sessionReducer = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_SESSION:
      return action.session;
    case RECEIVE_DATA:
      return action.data.session;
    default:
      return state;
  }
};

export const sessionsReducer = (state = [], action, root) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return action.data.sessions;
    case CREATE_NEW_SESSION: {
      const newSessions = cloneDeep(state);
      newSessions.push(createDefaultSession(newSessions.length));
      return newSessions;
    }
    case CREATE_NEW_ROW: {
      if (root.session === undefined) return state;

      const newSessions = cloneDeep(state);
      newSessions[root.session].rows = newSessions[root.session].rows.concat([
        createRow(action.numStopwatchCols, 'Stopwatch name')]);
      return newSessions;
    }
    case CREATE_NEW_COL: {
      if (root.session === undefined) return state;

      const newSessions = cloneDeep(state);
      newSessions[root.session].cols = newSessions[root.session].cols.map(row => ({
        [`col-${action.numCols}`]: 0,
        ...row,
      }));
      return newSessions;
    }

    case RECEIVE_STOPWATCH_TIME: {
      if (root.session === undefined) return state;

      const newSessions = cloneDeep(state);
      newSessions[root.session].rows[action.rowIdx][action.colId] = action.newTime;
      return newSessions;
    }
    case RECEIVE_STOPWATCH_NAME: {
      if (root.session === undefined) return state;

      const newSessions = cloneDeep(state);
      const newRows = newSessions[root.session].rows;
      newRows[action.rowIdx].name = action.newName;
      return newSessions;
    }
    case DELETE_ROW: {
      if (root.session === undefined) return state;

      const newSessions = cloneDeep(state);
      let newRows = newSessions[root.session].rows;
      if (newRows.length === 1) return state;
      newRows = newRows.slice(0, action.rowIdx).concat(newRows.slice(action.rowIdx + 1));
      newSessions[root.session].rows = newRows;
      return newSessions;
    }
    default:
      return state;
  }
};
