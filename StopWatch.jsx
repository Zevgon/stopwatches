/* eslint-disable react/prefer-stateless-function */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';

export default class StopWatch extends Component {
  constructor() {
    super();
    this.secondDivision = 10;
    this.stepSize = 1000 / this.secondDivision;
  }

  formatTime(days, hours, minutes, seconds) {
    const fDays = days ? `${days}d` : '';
    const fHours = days ? `${hours}h` : '';
    const fMinutes = minutes ? `${minutes}m` : '';
    return `${fDays} ${fHours} ${fMinutes} ${seconds}s`.trim();
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
    // return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    return this.formatTime(days, hours, minutes, seconds);
  }

  pause = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.forceUpdate();
  }

  emit(newVal) {
    const {
      onChange,
      column: { id: colId },
      index: rowIdx,
    } = this.props;

    if (typeof onChange === 'function') {
      onChange(newVal, colId, rowIdx);
    }
  }

  reset = () => {
    this.pause();
    this.emit(0);
  }

  start = () => {
    if (this.interval) return;

    this.interval = setInterval(() => {
      this.emit(this.props.value + this.stepSize);
    }, this.stepSize);
  }

  render() {
    return (
      <div>
        {this.humanReadableDuration()}
        {this.interval ?
          <button onClick={this.pause}>Stop</button> :
          <button onClick={this.start}>Start</button>
        }
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}
