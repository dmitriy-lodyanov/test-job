import * as api from './api'

it('load companies', () => {
    api.getCompanies()
        .then((data) => {
            console.log(data);
        })
})
it('load company info', () => {
    api.getCompanies()
        .then((data) => {
            return api.getCompanyData(data[0], 20)
        })
        .then((data) => {
            console.log(data);
        })

})
