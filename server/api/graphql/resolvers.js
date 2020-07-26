const mongoose = require('mongoose');

module.exports = {
    Query: {
        items:()=>mongoose.model('Item').find({}),
        item(root, args, context, info) {
            return mongoose.model('Item').findById(args.id)
        },
    },

};