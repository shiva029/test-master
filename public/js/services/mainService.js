angular.module('MainService',[]).factory('Main',  function($resource){
	return {
		login:$resource('/api/login', {}, {save:{method:'POST'}}),
		logout:$resource('/api/logout', {}, {get:{method:'GET'}}),
		register:$resource('/api/register', {}, {save:{method:'POST'}}),
		verifyEmail:$resource('/api/verify_email', {}, {save:{method:'POST'}}),
		generateOtp:$resource('/api/generate_otp', {}, {save:{method:'POST'}}),
	};
})