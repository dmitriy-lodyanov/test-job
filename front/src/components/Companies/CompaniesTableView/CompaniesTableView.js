import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import Table from 'components/Table';
import * as api from 'api';
import dataConfig from 'dataConfig';
import './CompaniesTableView.scss';

@observer
export default class CompaniesTableView extends Component {
  @observable
  data = null;

  limit = null;

  constructor (props) {
    super(props);

    this.changeLimit.bind(this);
  }

  componentDidMount () {
    this.fetchData();
  }

  @action
  fetchData () {
    this.data = null;

    const { limit } = this;

    let companies
    api.getCompanies()
      .then((companies_) => {
        companies = companies_
        const tasks = [];
        companies_.forEach((company) => {
          tasks.push(new Promise((resolve, _) => {
            resolve(api.getCompany(company, limit));
          }));
        });
        return Promise.all(tasks)
      })
      .then((values) => {
        const data_ = [];
        values.forEach((companyData, index) => {
          companyData.forEach((entry) => {
            data_.push({
              'Company Name': companies[index],
              ...entry,
            })
          })
        })
        this.data = data_;
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
    const {data} = this;

    return <div className="CompaniesTableView">
      <div className="CompaniesTableView-header">
        <span className="CompaniesTableView-limit-title">
          limit:
        </span>
        <input type="number" onChange={(event) => {this.changeLimit(event)}} />
        <button onClick={() => { this.fetchData() }}>
          update data
        </button>
      </div>
      {!data
          ? 'loading...'
          : <Table
              fields={[{type:'string', name:'Company Name'}, ...dataConfig]}
              data={data} />
      }
    </div>
  }
}

