/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  receiveStopwatchName,
  deleteRow,
} from './actions';

class RowHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      editingName: false,
    };
  }

  toggleEditName = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      editingName: !this.state.editingName,
    }, () => {
      if (this.state.editingName) {
        this.inputNode.focus();
        this.inputNode.select();
        return;
      }

      this.props.dispatch(receiveStopwatchName(this.state.name, this.props.index));
    });
  }

  updateName = (e) => { this.setState({ name: e.target.value }); }

  handleKeyUp = (e) => { if (e.which === 13) { this.toggleEditName(); } }

  deleteRow = () => {
    // const { onDeleteRow } = this.props;
    // if (typeof onDeleteRow === 'function') {
    //   onDeleteRow(this.props.index);
    // }
    this.props.dispatch(deleteRow(this.props.index));
  }

  render() {
    const { name, editingName } = this.state;
    const { editMode } = this.props;
    return (
      <div className="space-between">
        {editingName ?
          <input
            ref={(node) => { this.inputNode = node; }}
            type="text"
            value={this.state.name}
            onChange={this.updateName}
            onClick={(e) => { e.stopPropagation(); }}
            onKeyUp={this.handleKeyUp}
          /> :
          <span>{name}</span>
        }
        {editMode ?
          <div className="space-between">
            <button onClick={this.deleteRow}>Delete Row</button>
            <i
              className={this.state.editingName ? 'fa fa-floppy-o' : 'fa fa-pencil-square-o'}
              onClick={this.toggleEditName}
            />
          </div>
          : <div />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  editMode: state.editMode,
});

export default connect(mapStateToProps)(RowHeader);
