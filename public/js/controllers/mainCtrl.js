var mainCtrl = angular.module('MainCtrl',[]);

mainCtrl.controller('mainController',  function(Main, $scope, $state){
	$scope.data = {};
	$scope.login = function(){
		// console.log($scope.data)
		Main.login.save($scope.data,function(response){
			if(response.success){
				$state.go('home');
			}else{
				alert(response.errors.join('\n'));
			}
		});
	}
});


mainCtrl.controller('homeController', function(Main, $scope, $rootScope, $state){
	$scope.data = {};


	// $scope.logout = function(){
	// 	Main.logout.get({},function(response){
	//         if(response.success){
	//             $rootScope.currentUser=undefined;
	//             $state.go('login');
	//         } else{
	//             alert(response.errors.join('<br>'));
	//             // window.history.back();
	//         }
	//     });
	// }
	
});


mainCtrl.controller('registerController', function(Main, $scope, $state){
	$scope.data = {};
	$scope.register = function(){
		Main.register.save($scope.data,function(response){
			if(response.success){
				$state.go('verifyemail');
			}else{
				alert(response.errors.join('\n'));
			}
		});
	}
});

mainCtrl.controller('verifyEmailController', function(Main, $scope, $state){
	$scope.data = {};
	$scope.verify = function(){
		Main.verifyEmail.save($scope.data,function(response){
			if(response.success){
				alert('Email Verified Successfully');
				$state.go('login');
			}else{
				alert(response.errors.join('\n'));
			}
		});
	}
});

mainCtrl.controller('generateOtpController', function(Main, $scope, $state){
	$scope.data = {};
	$scope.generate = function(){
		Main.generateOtp.save($scope.data,function(response){
			if(response.success){
				$state.go('verifyemail');
			}else{
				alert(response.errors.join('\n'));
			}
		});
	}
});