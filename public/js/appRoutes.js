angular.module('appRoutes', []).config(['$stateProvider','$routeProvider','$locationProvider','$urlRouterProvider',function($stateProvider,$routeProvider,$locationProvider,$urlRouterProvider) {
	$urlRouterProvider.when('/','/login');

	$stateProvider.state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'mainController',
        authenticate:false
    });

    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'registerController',
        authenticate:false
    });

    $stateProvider.state('verifyemail', {
        url: '/verifyemail',
        templateUrl: 'views/verifyEmail.html',
        controller: 'verifyEmailController',
        authenticate:false
    });

    $stateProvider.state('generateotp', {
        url: '/generateotp',
        templateUrl: 'views/generateOtp.html',
        controller: 'generateOtpController',
        authenticate:false
    });

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'homeController',
        authenticate:true
    });


	$urlRouterProvider.otherwise('/')
    $locationProvider.html5Mode(true);
}]);