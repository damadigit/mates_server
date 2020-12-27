

const mongoose = require('mongoose');
module.exports = function (model) {
    const Model = mongoose.model(model);
   return composeWithMongoose(Model);
    //return ModelTC
}
