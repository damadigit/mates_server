const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
    type: String,
    name: String,
    content: String,
    isDefault: Boolean
})
module.exports = mongoose.model('Template', TemplateSchema);
