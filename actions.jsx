/* eslint-disable import/prefer-default-export */
import {
  TOGGLE_EDIT_MODE,
  RECEIVE_DATA,
  CREATE_NEW_ROW,
  CREATE_NEW_COL,
  RECEIVE_STOPWATCH_TIME,
  RECEIVE_STOPWATCH_NAME,
  DELETE_ROW,
} from './constants';

export const toggleEditMode = () => ({
  type: TOGGLE_EDIT_MODE,
});

export const receiveData = data => ({
  type: RECEIVE_DATA,
  data,
});

export const createNewRow = numStopwatchCols => ({
  type: CREATE_NEW_ROW,
  numStopwatchCols,
});

export const createNewCol = (numCols, onStopwatchChange) => ({
  type: CREATE_NEW_COL,
  numCols,
  onStopwatchChange,
});

export const receiveStopwatchTime = (newTime, colId, rowIdx) => ({
  type: RECEIVE_STOPWATCH_TIME,
  colId,
  rowIdx,
  newTime,
});

export const receiveStopwatchName = (newName, rowIdx) => ({
  type: RECEIVE_STOPWATCH_NAME,
  newName,
  rowIdx,
});

export const deleteRow = rowIdx => ({
  type: DELETE_ROW,
  rowIdx,
});
