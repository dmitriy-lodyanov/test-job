import * as axios from 'axios';

function getData(url) {
  return axios.get(url)
    .then(function (response) {
        return response.data;
    });
}

export function getCompanies() {
  return getData('/company/list')
}

export function getCompany(title, limit) {
  var query = '?title=' + title
  if (limit != null) {
    query += '&limit=' + limit;
  }
  return getData('/company/view' + query);
}

