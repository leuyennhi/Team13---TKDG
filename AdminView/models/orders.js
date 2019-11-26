var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    custom: { type: Schema.ObjectId, required: true },
    day: {type: Date, required: true},
    status: {type: String, required: true},
    address:{type: String, required: true},
    products:{type:Array, required: true},
    phone:{type:String, required:true},
    recipientname: {type: String, required: true},
    shipfee:{type: Number, required: true},
});

// Virtual for this Order instance URL.
OrderSchema
.virtual('url')
.get(function () {
  return '/order/'+this._id;
});

// Export model.
module.exports = mongoose.model('Order', OrderSchema);
    
