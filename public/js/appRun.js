//public/js/appRun.js
angular.module('appRun',[]).run(['$rootScope', '$state', 'Session', 'Main', function($rootScope, $state, Session, Main){
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		$rootScope.$state = $state;
		Session.session.get({},function(response){
			event.preventDefault();
			if(response.success){
				$rootScope.currentUser=response.result;
			}else{
				$rootScope.currentUser=undefined;
			}
			if(!response.success && toState.authenticate){
				//user session not existing
				$state.go('login');
				return;
			}
			if(response.success && !toState.authenticate){
				//user session existing
				$state.go('home');
				return;
			}
		});

	});

	$rootScope.logout = function(){
		Main.logout.get({},function(response){
	        if(response.success){
	            $rootScope.currentUser=undefined;
	            $state.go('login');
	        } else{
	            alert(response.errors.join('<br>'));
	            // window.history.back();
	        }
	    });
	}
}]);