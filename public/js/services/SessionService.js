// public/js/services/SessionService.js

angular.module('SessionService', []).factory('Session', function($resource) {

    return {
        session: $resource('/api/get_session', {}, {get:{method:'GET'}}), //end of get session
    }

});