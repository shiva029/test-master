var mongoose = require('mongoose');

function toLower (v) {
  return v.toLowerCase();
}

var users = mongoose.Schema({
	name: {type: String, required: true},
	username:{type:String, unique:true, sparse: true},
	email:{type:String, unique:true, sparse: true, set: toLower},
	password : {type:String, required:true, select: false},
	type:{type:String, required:true},
	active:{type:Boolean, default:true},
    delete:{type:Boolean, default:false},
    phone: {type:String},
    profilepic: {type:String},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    createdOn:{type:Date, default:new Date()},
    updatedBy: {type: mongoose.Schema.Types.ObjectId},
    updatedOn: {type:Date},
    mailVerified : {type: Boolean, default:true}
},{strict:true});

users.index({username:1}, { unique: true ,sparse: true});
module.exports = mongoose.model("users",users);