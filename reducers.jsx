import React from 'react';
import { cloneDeep } from 'lodash';
import {
  TOGGLE_EDIT_MODE,
  RECEIVE_DATA,
  CREATE_NEW_ROW,
  CREATE_NEW_COL,
  RECEIVE_STOPWATCH_TIME,
  RECEIVE_STOPWATCH_NAME,
  DELETE_ROW,
} from './constants';
import ColHeader from './ColHeader';
import StopWatch from './StopWatch';

export const createRow = (numStopwatchCols, name) => {
  const colIdToDefaultStopwatchVal = {};
  for (let i = 0; i < numStopwatchCols; i += 1) {
    colIdToDefaultStopwatchVal[`col-${i + 1}`] = 0;
  }
  return {
    name,
    ...colIdToDefaultStopwatchVal,
  };
};

const createColumn = (header, colIdx, onStopwatchChange, onUpdateHeader) => ({
  Header: () => (
    <ColHeader
      header={header}
      colIdx={colIdx}
      onUpdateHeader={onUpdateHeader}
    />
  ),
  accessor: `col-${colIdx}`,
  Cell: props => <StopWatch {...props} />,
});

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
    default:
      return state;
  }
};
