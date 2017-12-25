/* eslint-disable import/prefer-default-export */

import {
  TOGGLE_EDIT_MODE,
} from './constants';

export const editModeReducer = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_EDIT_MODE:
      return !state;
    default:
      return state;
  }
};
