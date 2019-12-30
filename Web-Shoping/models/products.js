var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: { type: String, required: true },
    catergory: { type: Schema.ObjectId, ref: 'Catergory', required: true },
<<<<<<< HEAD
    originalPrice: { type: Number },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    color: { type: Array, required: true },
    size: { type: Array, required: true },
    description: { type: String, required: false },
    img: { type: [String], require: true },
    dateImp: { type: Date, default: Date.now() },
    watch: { type: Number, default: 0 },
    bought: { type: Number },
    toTryImg: { type: Array },
    type: { type: String }
=======
    originalPrice: {type: Number},
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
    color:{type: Array, required: true},
    size:{type: Array, required: true},
    description:{type: String, required: false},
    img:{type:[String],require: true},
    dateImp: {type: Date, default: Date.now()},
    watch:{type: Number,default: 0 },
    bought:{type:Number},
    toTryImg:{type:Array},
    type: {type: String}
>>>>>>> dddcdfb0cc048602a985b3eecfadcc932fd4c1d9
});

// Virtual for this Product instance URL.
ProductSchema
    .virtual('url')
    .get(function() {
        return '/product/' + this._id;
    });

// Export model.
module.exports = mongoose.model('Product', ProductSchema);