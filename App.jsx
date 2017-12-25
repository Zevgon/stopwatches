import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import {
  toggleEditMode,
  receiveData,
  createNewRow,
  createNewCol,
  receiveSession,
  createNewSession,
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
    const { data } = props;
    const columns = data ? data.columns : null;
    const rows = data ? data.rows : null;

    const dataColumns = columns || [
      createFirstColumn(),
      createColumn('Stuffing', 1),
    ];

    const dataRows = rows || [createRow(dataColumns.length - 1, 'Turkey baking')];
    const dataToDispatch = {
      columns: dataColumns,
      rows: dataRows,
      session: 0,
      sessions: [{
        name: 'Session 1',
        rows: dataRows,
        cols: dataColumns,
      }],
    };

    this.props.dispatch(receiveData(dataToDispatch));
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

  updateSession = (sessionIdx) => {
    this.props.dispatch(receiveSession(sessionIdx));
  }

  createSession = () => {
    this.props.dispatch(createNewSession());
  }

  render() {
    return (
      <div>
        <div>
          Sessions:
          {this.props.sessions.map((session, idx) => (
            <button
              key={session.name}
              onClick={() => this.updateSession(idx)}
              className={idx === this.props.session ? 'blue' : ''}
            >{session.name}
            </button>
          ))}
        </div>
        <button onClick={this.createSession}>Create New Session</button>
        <div className="table-container-border">
          <div className="table-container">
            <button onClick={this.addRow}>Add row</button>
            <button onClick={this.addColumn}>Add column</button>
            <button
              onClick={this.toggleEditMode}
              className={this.props.editMode ? 'blue' : ''}
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
      </div>
    );
  }
}

const getRows = (state) => {
  if (!state.sessions) return [];
  const sessionData = state.sessions[state.session];
  if (!sessionData) return [];
  return sessionData.rows;
};

const getCols = (state) => {
  if (!state.sessions) return [];
  const sessionData = state.sessions[state.session];
  if (!sessionData) return [];
  return sessionData.cols;
};

const mapStateToProps = state => ({
  editMode: state.editMode,
  rows: getRows(state),
  cols: getCols(state),
  session: state.session,
  sessions: state.sessions,
});

export default connect(mapStateToProps)(App);
