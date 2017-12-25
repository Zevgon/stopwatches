import React from 'react';
import ColHeader from './ColHeader';
import StopWatch from './StopWatch';
import RowHeader from './RowHeader';

export const createColumn = (header, colIdx) => ({
  Header: () => (
    <ColHeader
      header={header}
      colIdx={colIdx}
    />
  ),
  accessor: `col-${colIdx}`,
  Cell: props => <StopWatch {...props} />,
});

export const createFirstColumn = () => ({
  Header: 'Name',
  accessor: 'name',
  Cell: ({ value, ...rest }) => (
    <RowHeader
      key={value}
      name={value}
      {...rest}
    />
  ),
});

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

export const formatTime = (days, hours, minutes, seconds) => {
  const fDays = days ? `${days}d` : '';
  const fHours = days ? `${hours}h` : '';
  const fMinutes = minutes ? `${minutes}m` : '';
  return `${fDays} ${fHours} ${fMinutes} ${seconds}s`.trim();
};
