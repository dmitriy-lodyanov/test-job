import React, { Component } from 'react';
import CompaniesTreeView from './CompaniesTreeView';
import CompaniesTableView from './CompaniesTableView';
import './Companies.scss';

export default class Companies extends Component {
  constructor() {
    super();
    this.state = {
      currentView: 'tree',
    }
    this.openTreeView = this.openTreeView.bind(this)
    this.openTableView = this.openTableView.bind(this)
  }
  openTreeView() {
    this.setState({
      currentView: 'tree',
    })
  }
  openTableView() {
    this.setState({
      currentView: 'table',
    })
  }
  renderView(name) {
    switch (name) {
      case 'tree':
        return <CompaniesTreeView />
      default:
        return <CompaniesTableView />
    }
  }
  render() {
    const { currentView } = this.state;

    return (
      <div>
        <button className="open-tree-view" onClick={this.openTreeView}>Tree View</button>
        <button className="open-table-view" onClick={this.openTableView}>Table View</button>

        {this.renderView(currentView)}
      </div>
    )
  }
}
