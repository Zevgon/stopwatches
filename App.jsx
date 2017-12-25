import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { merge } from 'lodash';
import StopWatch from './StopWatch';

const FIRST_COLUMN = {
  Header: 'Name',
  accessor: 'type',
};

const createColumn = (Header, colIdx, onStopwatchChange) => ({
  Header,
  accessor: `col-${colIdx}`,
  Cell: props => <StopWatch onChange={onStopwatchChange} {...props} />,
});

const EXAMPLE_TIMER = {
  type: 'Turkey baking',
  'col-1': 0,
};

const createRow = (numStopwatchCols) => {
  const defaultStopwatchCols = {};
  for (let i = 0; i < numStopwatchCols; i += 1) {
    defaultStopwatchCols[`col-${i + 1}`] = 0;
  }
  return {
    type: 'Stopwatch name',
    ...defaultStopwatchCols,
  };
};


export default class App extends React.Component {
  constructor(props) {
    super(props);
    const data = {
      columns: props.data.columns ? props.data.columns :
        [FIRST_COLUMN, createColumn('Type', 1, this.onStopwatchChange)],
      rows: props.data.rows ? props.data.rows : [EXAMPLE_TIMER],
    };
    this.state = { data };
  }

  componentWillUnmount() {
    localStorage.setItem('savable-timer-data', JSON.stringify(this.state.data));
  }

  onStopwatchChange = (newVal, colId, rowIdx) => {
    const newRow = { ...this.state.data.rows[rowIdx] };
    newRow[colId] = newVal;
    const newRows = [...this.state.data.rows];
    newRows[rowIdx] = newRow;
    this.setState(merge({}, this.state, { data: { rows: newRows } }));
  }

  addRow = () => {
    const newRow = createRow(1);
    const newRows = this.state.data.rows.concat([newRow]);
    this.setState(merge({}, this.state, { data: { rows: newRows } }));
  }

  render() {
    return (
      <div>
        <ReactTable
          data={this.state.data.rows}
          columns={this.state.data.columns}
          pageSize={this.state.data.rows.length}
          showPagination={false}
        />
        <button onClick={this.addRow}>Add row</button>
      </div>
    );
  }
}
