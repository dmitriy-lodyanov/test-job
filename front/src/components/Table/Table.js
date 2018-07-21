import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Dropdown from 'components/Dropdown';
import './Table.scss';

@observer
export default class Table extends Component {
  @observable
  fields = [];

  @observable
  data = [];

  filterStates = {};

  @observable
  sortState = { key: null, type: null, order: null };

  constructor(props) {
    super(props);

    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    const { fields, data } = this.props;

    this.data = data;
    this.fields = fields.map((field) => {
      return { ...field, hide: false };
    })

    fields.forEach((field) => {
      const key = field.name;

      switch (field.type) {
        case 'number':
          this.filterStates[key] = { type: 'number', from: null, to: null };
          break;
        case 'string':
          this.filterStates[key] = { type: 'string', value: null };
          break;
        default: ;
      }
    })
  }

  @action
  upField(field, index) {
    if (index < 1) {
      return;
    }
    const prevField = this.fields[index - 1];
    this.fields[index] = prevField;
    this.fields[index - 1] = field;
  }
  @action
  downField(field, index) {
    if (index > this.fields.length - 2) {
      return;
    }
    const nextField = this.fields[index + 1];
    this.fields[index] = nextField;
    this.fields[index + 1] = field;
  }
  @action
  toggleField(field) {
    field.hide = !field.hide;
  }

  filter(data) {
    for (const key in this.filterStates) {
      const filterState = this.filterStates[key];
      data = data.filter((entry) => {
        const value = entry[key];
        switch (filterState.type) {
          case 'number':
            const { from, to } = filterState;
            if (from != null && Number(value) < from) {
              return false;
            }
            if (to != null && Number(value) > to) {
              return false;
            }
            return true;
          case 'string':
            const filterValue = filterState.value;
            if (filterValue == null) {
              return true;
            }
            return value.indexOf(filterValue) !== -1;
          default: ;
            return true;
        }
      })
    }

    return data;
  }
  sort(data) {
    const { key, type, order } = this.sortState;

    if (key == null) {
      return data;
    }

    switch (type) {
      case 'number':
        switch (order) {
          case 'asc':
            return data.slice().sort((a, b) => {
              return Number(a[key]) - Number(b[key]);
            })
          case 'desc':
            return data.slice().sort((a, b) => {
              return -Number(a[key]) + Number(b[key]);
            })
          default:
            return data;
        }
      case 'string':
        switch (order) {
          case 'asc':
            return data.slice().sort((a, b) => {
              return ('' + a[key]).localeCompare(b[key]);
            })
          case 'desc':
            return data.slice().sort((a, b) => {
              return -('' + a[key]).localeCompare(b[key]);
            })
          default:
            return data;
        }
      default:
        return data;
    }
  }

  @action
  updateData() {
    this.data = this.sort(this.filter(this.props.data));
  }

  renderFilterNumberField(field) {
    const filterState = this.filterStates[field.name];

    const updateFromValue = (event) => {
      const { value } = event.target;
      if (value !== '') {
        filterState.from = Number(value);
      } else {
        filterState.from = null;
      }
      this.updateData()
    }
    const updateToValue = (event) => {
      const { value } = event.target;
      if (value !== '') {
        filterState.to = Number(value);
      } else {
        filterState.to = null;
      }
      this.updateData()
    }
    return <div>
      FILTER<br /><br />
      from
      <input type="number" onChange={updateFromValue} />
      to
      <input type="number" onChange={updateToValue} />
    </div>
  }
  renderFilterStringField(field) {
    const filterState = this.filterStates[field.name];

    const updateValue = (event) => {
      const { value } = event.target;
      if (value != null) {
        filterState.value = value;
      } else {
        filterState.value = null;
      }
      this.updateData()
    }
    return <div>
      FILTER<br />
      <input type="text" onChange={updateValue} />
    </div>
  }
  renderFilterField(field) {
    switch (field.type) {
      case 'number':
        return this.renderFilterNumberField(field);
      case 'string':
        return this.renderFilterStringField(field);
      default: ;
    }
  }
  renderSortField(field) {
    const updateSort = (order) => {
      if (this.sortState.key === field.name && this.sortState.order === order) {
        this.sortState.key = null;
        this.sortState.type = null;
        this.sortState.order = null;
      } else {
        this.sortState.key = field.name;
        this.sortState.type = field.type;
        this.sortState.order = order;
      }
      this.updateData()
    }

    return <div className="Table-sort">
      SORT<br />
      <button onClick={() => { updateSort('asc') }}>ASC</button>
      <button onClick={() => { updateSort('desc') }}>DESC</button>
      <div className="Table-sort-title">{this.sortState.key === field.name && (
        this.sortState.order === 'asc'
          ? 'ASC'
          : 'DESC'
      )
      }</div>
    </div>
  }
  render() {
    const { fields, data } = this

    const showFields = fields.filter((field) => {
      return field.hide ? false : true;
    })
    return (
      <table className="Table">
        <thead>
          <tr>
            <th colSpan={fields.length}>
              <Dropdown title="Columns Settings" menu={
                fields.map((field, index) => {
                  return <div className="Table-dropdown-item" key={field.name}>
                    <div>{field.name}</div>
                    <button onClick={() => { this.upField(field, index) }}>
                      UP
                    </button>
                    <button onClick={() => { this.downField(field, index) }}>
                      DOWN
                    </button>
                    <button onClick={() => { this.toggleField(field) }}>
                      {field.hide ? 'SHOW' : 'HIDE'}
                    </button>
                  </div>;
                })
              } />
            </th>
          </tr>
          <tr>
            {showFields.map((field) => {
              return <th key={field.name}>
                {field.name}
              </th>
            })}
          </tr>
          <tr>
            {showFields.map((field) => {
              return <th key={field.name}>{this.renderFilterField(field)}</th>
            })}
          </tr>
          <tr>
            {showFields.map((field) => {
              return <th key={field.name}>{this.renderSortField(field)}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => {
            return <tr key={index}>
              {showFields.map((field) => {
                return <td key={field.name}>{entry[field.name]}</td>
              })}
            </tr>
          })}
        </tbody>
      </table>
    )
  }
}
