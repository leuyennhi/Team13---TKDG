var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {type: String, required: true},
    catergory: { type: Schema.ObjectId, ref: 'Catergory', required: true },
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
    color:{type: String, required: true},
    size:{type:String, required: true},
    description:{type: String, required: false},
    img:{type:[String],require: true},
    dateImp: {type: Date, default: Date.now()},
});

// Virtual for this Product instance URL.
ProductSchema
.virtual('url')
.get(function () {
  return '/product/'+this._id;
});

// Export model.
module.exports = mongoose.model('Product', ProductSchema);