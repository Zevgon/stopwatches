import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { merge } from 'lodash';
import { connect } from 'react-redux';
import { toggleEditMode } from './actions';
import StopWatch from './StopWatch';
import ColHeader from './ColHeader';
import RowHeader from './RowHeader';
import './master.css';

const createFirstColumn = onUpdateName => ({
  Header: 'Name',
  accessor: 'name',
  Cell: ({ value, ...rest }) => (
    <RowHeader
      name={value}
      onUpdateName={onUpdateName}
      {...rest}
    />
  ),
});

const createColumn = (header, colIdx, onStopwatchChange, onUpdateHeader) => ({
  Header: () => (
    <ColHeader
      header={header}
      colIdx={colIdx}
      onUpdateHeader={onUpdateHeader}
    />
  ),
  accessor: `col-${colIdx}`,
  Cell: props => <StopWatch onChange={onStopwatchChange} {...props} />,
});

const createRow = (numStopwatchCols, name) => {
  const colIdToDefaultStopwatchVal = {};
  for (let i = 0; i < numStopwatchCols; i += 1) {
    colIdToDefaultStopwatchVal[`col-${i + 1}`] = 0;
  }
  return {
    name,
    ...colIdToDefaultStopwatchVal,
  };
};


class App extends React.Component {
  constructor(props) {
    super(props);
    const { data: { columns, rows } } = props;
    const dataColumns = columns || [
      createFirstColumn(this.onUpdateName),
      createColumn('Stuffing', 1, this.onStopwatchChange, this.onUpdateHeader),
    ];
    const data = {
      columns: dataColumns,
      rows: rows || [createRow(dataColumns.length - 1, 'Turkey baking')],
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

  onUpdateHeader = (newHeader, colIdx) => {
    const newCols = [...this.state.data.columns];
    newCols[colIdx] = createColumn(newHeader, colIdx, this.onStopwatchChange, this.onUpdateHeader);
    this.setState(merge({}, this.state, { data: { columns: newCols } }));
  }

  onUpdateName = (newName, rowIdx) => {
    const newRows = [...this.state.data.rows];
    newRows[rowIdx] = {
      name: newName,
      ...newRows[rowIdx],
    };
    this.setState(merge({}, this.state, { data: { rows: newRows } }));
  }

  addRow = () => {
    const newRow = createRow(this.state.data.columns.length - 1, 'Stopwatch name');
    const newRows = this.state.data.rows.concat([newRow]);
    this.setState(merge({}, this.state, { data: { rows: newRows } }));
  }

  addColumn = () => {
    const { data: { columns, rows } } = this.state;
    const newColumn = createColumn('Stopwatch Type', columns.length, this.onStopwatchChange);
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

  toggleEditMode = () => {
    this.props.dispatch(toggleEditMode());
  }

  render() {
    return (
      <div>
        <button onClick={this.addRow}>Add row</button>
        <button onClick={this.addColumn}>Add column</button>
        <button onClick={this.toggleEditMode}>Edit</button>
        <ReactTable
          data={this.state.data.rows}
          columns={this.state.data.columns}
          pageSize={this.state.data.rows.length}
          showPagination={false}
          resizable={false}
        />
      </div>
    );
  }
}

export default connect()(App);
