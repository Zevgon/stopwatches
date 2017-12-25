import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { merge } from 'lodash';
import { connect } from 'react-redux';
import {
  toggleEditMode,
  receiveData,
  createNewRow,
  createNewCol,
} from './actions';
import { createRow } from './reducers';
import StopWatch from './StopWatch';
import ColHeader from './ColHeader';
import RowHeader from './RowHeader';
import './master.css';

const createFirstColumn = (onUpdateName, onDeleteRow) => ({
  Header: 'Name',
  accessor: 'name',
  Cell: ({ value, ...rest }) => (
    <RowHeader
      key={value}
      name={value}
      onUpdateName={onUpdateName}
      onDeleteRow={onDeleteRow}
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

class App extends React.Component {
  constructor(props) {
    super(props);
    const { data: { columns, rows } } = props;
    const dataColumns = columns || [
      createFirstColumn(this.onUpdateName, this.onDeleteRow),
      createColumn('Stuffing', 1, this.onStopwatchChange, this.onUpdateHeader),
    ];

    const dataRows = rows || [createRow(dataColumns.length - 1, 'Turkey baking')];
    const data = {
      columns: dataColumns,
      rows: dataRows,
    };

    this.props.dispatch(receiveData(data));
  }

  componentWillUnmount() {
    localStorage.setItem('savable-timer-data', JSON.stringify(this.state.data));
  }

  onUpdateHeader = (newHeader, colIdx) => {
    const newCols = [...this.state.data.columns];
    newCols[colIdx] = createColumn(newHeader, colIdx, this.onStopwatchChange, this.onUpdateHeader);
    this.setState(merge({}, this.state, { data: { columns: newCols } }));
  }

  onUpdateName = (newName, rowIdx) => {
    const newRows = [...this.state.data.rows];
    newRows[rowIdx] = {
      ...newRows[rowIdx],
      name: newName,
    };
    this.setState(merge({}, this.state, { data: { rows: newRows } }));
  }

  onDeleteRow = (rowIdx) => {
    const rows = this.state.data.rows.map(row => ({ ...row }));
    if (rows.length === 1) return;

    const newRows = rows.slice(0, rowIdx).concat(rows.slice(rowIdx + 1));
    this.setState({
      data: {
        ...this.state.data,
        rows: newRows,
      },
    });
  }

  addRow = () => {
    this.props.dispatch(createNewRow(this.props.cols.length - 1));
  }

  addColumn = () => {
    this.props.dispatch(createNewCol(this.props.cols.length));
  }

  toggleEditMode = () => {
    this.props.dispatch(toggleEditMode());
  }

  render() {
    return (
      <div>
        <button onClick={this.addRow}>Add row</button>
        <button onClick={this.addColumn}>Add column</button>
        <button
          onClick={this.toggleEditMode}
          className={this.props.editMode ? 'editing' : ''}
        >Edit
        </button>
        {this.props.rows && this.props.cols &&
          <ReactTable
            data={this.props.rows}
            columns={this.props.cols}
            pageSize={this.props.rows.length}
            showPagination={false}
            resizable={false}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  editMode: state.editMode,
  rows: state.rows,
  cols: state.cols,
});

export default connect(mapStateToProps)(App);
