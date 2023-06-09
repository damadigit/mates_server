const axios = require('axios');
const service = axios.create({
    baseURL: process.env.KEY_VALUE_API ||  'https://apis.truwrk.com/dama_quat',

    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});

const getWorkCloseDays = () => service.get('/workclosedays')
module.exports = {
    getWorkCloseDays
}
