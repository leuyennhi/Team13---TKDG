var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true},
    sex:{type: String, require: true},
    address:{type: String, require: true},
    email:{type:String,require: true},
    birthday:{type:Date,require:true},
    lock:{type:Boolean,default:false},
});

// Virtual for this Product instance URL.
UserSchema
.virtual('url')
.get(function () {
  return '/user/'+this._id;
});

// Export model.
module.exports = mongoose.model('User', UserSchema);