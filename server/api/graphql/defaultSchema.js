const mongoose = require('mongoose');
module.exports = function (name) {
    const Model = mongoose.model(model);
   return composeWithMongoose(Model);
    //return ModelTC
}
