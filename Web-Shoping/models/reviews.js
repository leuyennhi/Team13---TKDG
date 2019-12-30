var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    name: { type: String, required: Boolean },
<<<<<<< HEAD
    content: { type: String, required: Boolean },
    product: { type: Schema.ObjectId, required: Boolean },
    star: { type: Number, required: Boolean }
=======
    content: {type: String, required: Boolean},
    product: {type: Schema.ObjectId, required: Boolean},
    star: {type:Number, required: Boolean}
>>>>>>> dddcdfb0cc048602a985b3eecfadcc932fd4c1d9
});

// Export model.
module.exports = mongoose.model('Review', ReviewSchema);