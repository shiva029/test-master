var path = require('path');
var mongoose = require('mongoose');
const sendmail = require('sendmail')();
var validator = require('email-validator');

var Users = require('./models/users');
var Otps = require('./models/otps');

module.exports = function(app){

	app.post('/api/login', function(req, res){
		var result = { success: false, errors: [], result:[] };
		var data = req.body;
		// console.log(data);
		var errors = []; 
		if(!data.username){
			errors.push('Username or email is required');
		} 
		if(!data.password){
			errors.push('password is required');
		}
		if(errors.length){
			result.errors = errors;
			return res.json(result);
		}else{
			var where = {
				$or: [{ username: data.username, password: data.password }, { email: data.username, password: data.password } ],delete:false
			}
			Users.findOne(where, function(err, user) {
	            if (err) {
	                result.errors.push(err.message);
	                return res.json(result);
	            } else {
	                if (user) {
	                	if(!user.active && user.mailVerified ){
	                		result.errors.push('Your account has been inactive. \nContact to admin!');
	                    	return res.json(result);
	                	}else if(!user.mailVerified){
	                		result.errors.push('Please verify email!');
	                    	return res.json(result);
	                	}else{
		                    result.success = true;
		                    result.result = user;
		                    // Session creating  here
		                    req.session.user = user;
		                    req.session.cookie.maxAge = null;
		                    req.session.save();
		                    // console.log(req.session);
		                    return res.json(result)
	                	}
	                } else {
	                    result.errors.push('Invalid credentials!');
	                    return res.json(result);
	                }
	            }
	        });
		}
	});

	app.get('/api/logout',function(req, res){
		var result = { success: false, result: [], errors: [] };
        req.session.destroy();
        result.success = true;
        return res.json(result);
	});

	app.post('/api/register', function(req, res){
		var result = { success: false, errors: [], result:[] };
		var data = req.body;
		// console.log(data);
		var errors = []; 
		if(!data.email){
			errors.push('Email is required');
		}else if( !validator.validate(data.email)){
			errors.push('Valid email is required')
		}
		if(!data.password){
			errors.push('Password is required');
		}
		if(!data.username){
			errors.push('Username is required');
		}
		if(!data.name){
			errors.push('Name is required');
		}
		if(errors.length){
			result.errors = errors;
			return res.json(result);
		}else{
			var id = mongoose.Types.ObjectId();
			data.mailVerified = false;
			data.active = true;
			data.delete = false;
			data.type = 'Admin';
			data._id = id;
			data.createdBy = id;
			data.createdOn = new Date();
			var userInfo = new Users(data);
			userInfo.save(function(err, resUser){
				if(err){
					result.errors.push(err.message);
					return res.json(result);
				}else{
					var otp = Math.floor(100000 + Math.random() * 900000);
					var obj = {_id : id, otp : otp, createdOn: new Date() };
					Otps.update({_id: id}, obj, {upsert: true}, function (err,resOtp) {
						if(err){
							Users.remove({_id:id},function(err,resRem){
								result.errors.push('Registration failed try after some times');
								return res.json(result);
							});
						}else{
							sendmail({
								from: 'no-reply@test.com',
								to: data.email,
								subject: 'Registration Otp',
								html: 'Otp is : '+ otp,
							}, function(err, reply) {
								console.log(err && err.stack);
								// console.dir(reply);

							});
							result.success = true;
							result.result = resUser;
							return res.json(result);
						}
					});
				}
			});
		}
	});

	app.post('/api/verify_email', function(req, res){
		var result = {success: false, result:[], errors:[]};
		var data = req.body;
		var errors = [];
		if(!data.email){
			errors.push('Email is required');
		}else if( !validator.validate(data.email)){
			errors.push('Valid email is required')
		}
		if(!data.otp){
			errors.push('Otp is required');
		}
		if(errors.length){
			result.errors = errors;
			return res.json(result);
		}else{
			Users.findOne({email:data.email}, function(err, resUser){
				if(err){
					result.errors.push(err.message);
					return res.json(result);
				}else if(resUser){
					Otps.findOne({_id:resUser._id, otp:data.otp}, function(err, resOtp){
						if(err){
							result.errors.push(err.message);
							return res.json(result);
						}else if(resOtp){
							Users.update({_id:resUser._id}, {$set:{mailVerified:true}}, function(err){
								if(err){
									result.errors.push(err.message);
									return res.json(result);
								}else{
									Otps.remove({_id:resUser._id},function(err, rmOtp){
										result.success = true;
										return res.json(result);
									});
								}
							});
						}else{
							result.errors.push('Please enter valid otp');
							return res.json(result);
						}
					});
				}else{
					result.errors.push('Email not found');
					return res.json(result);
				}
			});
		}
	});

	//get session info
    app.get('/api/get_session', function(req, res) {
        var result = { success: false, result: [], errors: [] };
        // console.log(req.session.user)
        if (req.session && req.session.user && req.session.user._id) {
            var _id = mongoose.Types.ObjectId(req.session.user._id)
            Users.findOne({_id:_id,delete:false},function(err,user){
                if(err){
                    result.errors.push(err.message);
                    return res.json(result);
                }else if(user){
                    result.success = true;
                    req.session.user = user;
                    req.session.save();
                    result.result = req.session.user;
                    return res.json(result);
                }else{
                    result.errors.push('No user existing in session');
                    return res.json(result);
                }
            })
        }else{
        	result.errors.push('No user existing in session');
            return res.json(result);
        }
    });

    app.post('/api/generate_otp', function(req, res){
    	var result = {success: false, result:[], errors:[]};
		var data = req.body;
		var errors = [];
		if(!data.email){
			errors.push('Email is required');
		}else if( !validator.validate(data.email)){
			errors.push('Valid email is required')
		}
		if(errors.length){
			result.errors = errors;
			return res.json(result);
		}else{
			Users.findOne({email:data.email}, function(err, resUser){
				if(err){
					result.errors.push(err.message);
					return res.json(result);
				}else if(resUser){
					var otp = Math.floor(100000 + Math.random() * 900000);
					var obj = {_id : resUser._id, otp : otp, createdOn: new Date() };
					Otps.update({_id: resUser._id}, obj, {upsert: true}, function (err,resOtp) {
						if(err){
							result.errors.push(err.message);
							return res.json(result);
						}else{
							sendmail({
								from: 'no-reply@gmail.com',
								to: data.email,
								subject: 'Registration Otp',
								html: 'Otp is : '+ otp,
							}, function(err, reply) {
								console.log(err && err.stack);
								// console.dir(reply);

							});
							result.success = true;
							result.result = resUser;
							return res.json(result);
						}
					});
				}else{
					result.errors.push('Email not found');
					return res.json(result);
				}
			});
		}
    });

	app.get('*', function(req,res){
		res.sendFile(path.resolve('public/index.html'))
	});
}