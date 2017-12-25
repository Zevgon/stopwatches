/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';

export default class RowHeader extends Component {
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
      if (this.state.editingName) return;

      const { onUpdateName } = this.props;
      if (typeof onUpdateName === 'function') {
        onUpdateName(this.state.name, this.props.index);
      }
    });
  }

  updateName = (e) => { this.setState({ name: e.target.value }); }

  handleKeyUp = (e) => {
    if (e.which === 13) {
      this.toggleEditName();
    }
  }

  render() {
    const { name, editingName } = this.state;
    return (
      <div>
        {editingName ?
          <input
            type="text"
            value={this.state.name}
            onChange={this.updateName}
            onClick={(e) => { e.stopPropagation(); }}
            onKeyUp={this.handleKeyUp}
          /> :
          <span>{name}</span>
        }
        <i
          className={this.state.editingName ? 'fa fa-floppy-o' : 'fa fa-pencil-square-o'}
          onClick={this.toggleEditName}
        />
      </div>
    );
  }
}
