import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import Table from 'components/Table';
import * as api from 'api';
import dataConfig from 'dataConfig';
import './CompaniesTreeView.scss';

@observer
export default class CompaniesTreeView extends Component {
  @observable
  companies = [];

  constructor(props) {
    super(props);
    this.onCompanyToggle = this.onCompanyToggle.bind(this);
  }

  @action
  onCompanyToggle(companyComponent, listId) {
    const {companies} = this;
    companies.forEach((company, index) => {
      if (index === listId) {
        company.isDataDisplayed = !company.isDataDisplayed;
        if (company.isDataDisplayed) {
          companyComponent.fetchData();
        }
      } else {
        company.isDataDisplayed = false;
      }
    })
  }

  componentDidMount() {
    api.getCompanies()
      .then((companies) => {
        this.companies = companies.map((title) => {
          return {
            title,
            isDataDisplayed: false,
          }
        })
      })
  }

  render() {
    const { companies } = this;
    return (
      <div className="CompaniesTreeView">
        {!companies
          ? 'loading...'
          : companies.map((company, index) => {
            return <TreeViewCompany
              key={company.title}
              listId={index}
              title={company.title}
              isDataDisplayed={company.isDataDisplayed}
              onToggle={this.onCompanyToggle} />;
          })
        }
      </div>
    )
  }
}

@observer
class TreeViewCompany extends Component {
  @observable
  data = null;

  limit = null;

  constructor (props) {
    super(props);

    this.changeLimit.bind(this);
  }

  @action
  fetchData () {
    this.data = null;

    const { title } = this.props;
    const { limit } = this;

    api.getCompany(title, limit)
      .then((data) => {
        this.data = data;
      })
  }

  changeLimit (event) {
    const {value} = event.target;

    if (value === '') {
      this.limit = null;
    } else {
      this.limit = Number(value);
    }
  }

  render() {
    const {listId, title, isDataDisplayed, onToggle} = this.props
    const {data} = this

    return <div className="CompaniesTreeView_TreeViewCompany">
      <div className="CompaniesTreeView_TreeViewCompany-header">
        {title}
        <button onClick={() => { onToggle(this, listId) }}>
          {isDataDisplayed ? 'HIDE' : 'SHOW'}
        </button>
        <span className="CompaniesTreeView_TreeViewCompany-limit-title">
          limit:
        </span>
        <input type="number" onChange={(event) => {this.changeLimit(event)}} />
        <button onClick={() => { this.fetchData() }}>
          update data
        </button>
      </div>
      {isDataDisplayed &&
        (!data
          ? 'loading...'
          : <Table fields={dataConfig} data={data} />)
      }
    </div>
  }
}

