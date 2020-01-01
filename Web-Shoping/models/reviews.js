var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  name: { type: String, required: Boolean },
  content: { type: String, required: Boolean },
  product: { type: Schema.ObjectId, required: Boolean },
  star: { type: Number, required: Boolean },
  avatar: { type: String, require: Boolean },
  reply: { type: Array, required: Boolean },
  date: { type: Date }
});

// Export model.
module.exports = mongoose.model('Review', ReviewSchema);
