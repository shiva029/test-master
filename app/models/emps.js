var mongoose = require('mongoose');
var emps = mongoose.Schema({
	username : {type:String, required:true},
	password : {type:String, required:true, select: false}
},{strict:true});
emps.index({username:1});
module.exports = mongoose.model("emps",emps);