var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  img: { type: String, require: true }
});

// Virtual for this Category instance URL.
CategorySchema.virtual('url').get(function() {
  return '/categories/' + this._id;
});

// Export model.
module.exports = mongoose.model('Category', CategorySchema);
