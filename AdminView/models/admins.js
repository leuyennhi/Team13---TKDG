var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    name:{type: String, required: true},
    title:{type: String, require: true},
    email:{type:String,require: true},
    phone:{type:String},
    gender:{type:String},
    address:{type:String},
    birthday:{type:Date},
    pass:{type:String,require:true},
});

// Virtual for this Admin instance URL.
AdminSchema
.virtual('url')
.get(function () {
  return '/admin/'+this._id;
});

// Export model.
module.exports = mongoose.model('Admin', AdminSchema);