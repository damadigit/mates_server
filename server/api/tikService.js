const axios = require('axios');
const service = axios.create({
    baseURL: process.env.TIK_API ||  'https://apis.truwrk.com/tikserver/api', //'https://tikserver.herokuapp.com/api',

    // timeout: 1000,
    headers: {'x-company': 'DEWETO'}
});

 const getFinalHours = ({startDate, endDate, fillRest=true, maxHours=196, month, year}) => service.get('/hours', { params: { startDate, endDate, fillRest, maxHours, month, year }})
module.exports = {
    getFinalHours
}
