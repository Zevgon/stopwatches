/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';

export default class ColHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      editingHeader: false,
    };
  }

  updateHeader = (e) => { this.setState({ header: e.target.value }); }

  toggleEditHeader = (e) => {
    e.stopPropagation();
    this.setState({
      editingHeader: !this.state.editingHeader,
    }, () => {
      if (this.state.editingHeader) return;

      const { onUpdateHeader } = this.props;
      if (typeof onUpdateHeader === 'function') {
        onUpdateHeader(this.state.header, this.props.colIdx);
      }
    });
  }

  render() {
    const { header, editingHeader } = this.state;
    return (
      <div>
        {editingHeader ?
          <input
            type="text"
            value={this.state.header}
            onChange={this.updateHeader}
            onClick={(e) => { e.stopPropagation(); }}
          /> :
          <div>{header}</div>
        }
        <i
          className="fa fa-pencil-square-o"
          onClick={this.toggleEditHeader}
        />
      </div>
    );
  }
}
