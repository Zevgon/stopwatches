/* eslint-disable react/prefer-stateless-function */
/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveStopwatchTime } from './actions';
import { formatTime } from './utils';

class StopWatch extends Component {
  constructor() {
    super();
    this.secondDivision = 10;
    this.stepSize = 1000 / this.secondDivision;
    this.existingMss = 0;
  }

  humanReadableDuration = () => {
    let { value } = this.props;
    const seconds = parseFloat((value % 60000) / 1000).toFixed(1);
    value = Math.floor(value / 60000);
    const minutes = value % 60;
    value = Math.floor(value / 60);
    const hours = value % 24;
    value = Math.floor(value / 24);
    const days = value;
    return formatTime(days, hours, minutes, seconds);
  }

  pause = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.emit(new Date() - this.startTime);
    this.forceUpdate();
    this.existingMss = this.props.value;
  }

  emit(newVal) {
    const { column: { id: colId }, index: rowIdx } = this.props;
    this.props.dispatch(receiveStopwatchTime(newVal + this.existingMss, colId, rowIdx));
  }

  reset = () => {
    this.pause();
    this.existingMss = 0;
    this.emit(0);
  }

  start = () => {
    if (this.interval) return;

    this.startTime = new Date();
    this.interval = setInterval(() => {
      this.emit(new Date() - this.startTime);
    }, this.stepSize);
  }

  render() {
    return (
      <div className="stopwatch-time">
        {this.interval ?
          <button onClick={this.pause}>Stop</button> :
          <button onClick={this.start}>Start</button>
        }
        {this.humanReadableDuration()}
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}

export default connect()(StopWatch);
