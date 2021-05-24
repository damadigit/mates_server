const axios = require('axios');
const service = axios.create({
    baseURL: process.env.CATCHEL_API ||  'https://catchel-damaben.vercel.app',

    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});

const postCatchelMessage = ({to,subject, methods, body, email, senderEmail, from = 'Mates HCM', date=new Date()},client='Deweto') => service.post('/message', {
    to,
    subject,
    methods,
    body,
    client,
    email,
    senderEmail,
    from,
    date,

})

module.exports = {
    postCatchelMessage
}
