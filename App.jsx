import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import {
  toggleEditMode,
  receiveData,
  createNewRow,
  createNewCol,
} from './actions';
import {
  createColumn,
  createFirstColumn,
  createRow,
} from './utils';
import './master.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    const { data: { columns, rows } } = props;
    const dataColumns = columns || [
      createFirstColumn(),
      createColumn('Stuffing', 1),
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
      <div className="table-container-border">
        <div className="table-container">
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
