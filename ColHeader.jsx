/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class ColHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      editingHeader: false,
    };
  }

  updateHeader = (e) => {
    this.setState({ header: e.target.value });
  }

  handleKeyUp = (e) => {
    if (e.which === 13) {
      this.toggleEditHeader();
    }
  }

  toggleEditHeader = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      editingHeader: !this.state.editingHeader,
    }, () => {
      if (this.state.editingHeader) {
        this.inputNode.focus();
        this.inputNode.select();
        return;
      }

      const { onUpdateHeader } = this.props;
      if (typeof onUpdateHeader === 'function') {
        onUpdateHeader(this.state.header, this.props.colIdx);
      }
    });
  }

  render() {
    const { header, editingHeader } = this.state;
    const { editMode } = this.props;
    return (
      <div className="space-between">
        <div />
        {editingHeader ?
          <input
            ref={(node) => { this.inputNode = node; }}
            type="text"
            value={this.state.header}
            onChange={this.updateHeader}
            onClick={(e) => { e.stopPropagation(); }}
            onKeyUp={this.handleKeyUp}
          /> :
          <span>{header}</span>
        }
        {editMode ?
          <i
            className={this.state.editingHeader ? 'fa fa-floppy-o' : 'fa fa-pencil-square-o'}
            onClick={this.toggleEditHeader}
          /> : <div />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  editMode: state.editMode,
});

export default connect(mapStateToProps)(ColHeader);
