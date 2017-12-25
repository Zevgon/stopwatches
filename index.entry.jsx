import React from 'react';
import { render } from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  render(<App
    data={JSON.parse(localStorage.getItem('savable-timer-data'))}
  />, document.getElementById('app'));
});
