var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    name: { type: String, required: true },
    content: {type: String, required: true},
    product: {type: Schema.ObjectId, required: true},
    star: {type:String, required: true}
});

// Export model.
module.exports = mongoose.model('Review', ReviewSchema);
    