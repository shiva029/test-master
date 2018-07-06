var mongoose = require('mongoose');
var otps = mongoose.Schema({
    otp: {type: String, required: true},
    createdOn:{type:Date, default:new Date()},
},{strict:true});

module.exports = mongoose.model("otps",otps);