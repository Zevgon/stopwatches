import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { merge } from 'lodash';
import StopWatch from './StopWatch';

const FIRST_COLUMN = {
  Header: 'Name',
  accessor: 'name',
};

const createColumn = (Header, colIdx, onStopwatchChange) => ({
  Header,
  accessor: `col-${colIdx}`,
  Cell: props => <StopWatch onChange={onStopwatchChange} {...props} />,
});

const EXAMPLE_TIMER = {
  name: 'Turkey baking',
  'col-1': 0,
};

const createRow = (numStopwatchCols) => {
  const defaultStopwatchCols = {};
  for (let i = 0; i < numStopwatchCols; i += 1) {
    defaultStopwatchCols[`col-${i + 1}`] = 0;
  }
  return {
    name: 'Stopwatch name',
    ...defaultStopwatchCols,
  };
};


export default class App extends React.Component {
  constructor(props) {
    super(props);
    const { data: { columns, rows } } = props;
    const data = {
      columns: columns ||
        [FIRST_COLUMN, createColumn('Type', 1, this.onStopwatchChange)],
      rows: rows || [EXAMPLE_TIMER],
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
    const newRow = createRow(this.state.data.columns.length - 1);
    const newRows = this.state.data.rows.concat([newRow]);
    this.setState(merge({}, this.state, { data: { rows: newRows } }));
  }

  addColumn = () => {
    const { data: { columns, rows } } = this.state;
    const newColumn = createColumn('Type', columns.length, this.onStopwatchChange);
    const newColumns = columns.concat([newColumn]);
    const newRows = rows.map(row => ({
      [`col-${columns.length}`]: 0,
      ...row,
    }));
    this.setState(merge({}, this.state, {
      data: {
        columns: newColumns,
        rows: newRows,
      },
    }));
  }

  render() {
    return (
      <div>
        <button onClick={this.addRow}>Add row</button>
        <button onClick={this.addColumn}>Add column</button>
        <ReactTable
          data={this.state.data.rows}
          columns={this.state.data.columns}
          pageSize={this.state.data.rows.length}
          showPagination={false}
        />
      </div>
    );
  }
}
