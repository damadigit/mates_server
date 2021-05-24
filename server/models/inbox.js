const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InboxSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    body: String,
    type: String,
    ref: String, //id of the object based on type
    flagged: Boolean

})
module.exports = mongoose.model('Inbox', InboxSchema);
