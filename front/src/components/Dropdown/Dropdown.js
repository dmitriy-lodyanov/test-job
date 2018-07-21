import React, { Component } from 'react';
import './Dropdown.scss';

export default class Dropdown extends Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false,
    }

    this.toggle = this.toggle.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggle () {
    this.setState({
      open: !this.state.open,
    })
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef (node) {
    this.wrapperRef = node;
  }
  
  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.open) {
        this.setState({
          open: false,
        })
      }
    }
  }

  render () {
    const {title, menu} = this.props;
    const {open} = this.state;

    return <div
        ref={this.setWrapperRef}
        className={'Dropdown' + (open?' open':'')}>
      <div className="Dropdown-title" onClick={() => {this.toggle()}}>
        {title}
      </div>
      <div className="Dropdown-menu">{menu}</div>
    </div>
  }
}