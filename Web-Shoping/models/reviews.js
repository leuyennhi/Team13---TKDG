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
    star: {type:Number, required: Boolean},
    avatar: {type: String, require: Boolean},
    reply: {type: Array, required: Boolean},
    date: {type: Date}
>>>>>>> e64ac7f0934d22ecf6b76c21cbdb513ef49aaa42
});

// Export model.
module.exports = mongoose.model('Review', ReviewSchema);