(function () {
  'use strict';

  angular.module('dashboardApp').config(function ($routeProvider) {
    $routeProvider

      // route for the dashboard page
      .when('/', {
        templateUrl: 'app/components/dashboard/dashboard.view.html',
        controller: 'DashboardController'
      })
      .otherwise({ redirectTo: '/' })
  });
})();