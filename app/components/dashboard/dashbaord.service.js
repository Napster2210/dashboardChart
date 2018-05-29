(function () {
  'use strict';

  angular
    .module('dashboardApp')
    .factory('DashbaordService', DashbaordService);

  DashbaordService.$inject = ['$http', '$q'];
  function DashbaordService($http, $q) {
    var service = {
      fetchInitialData: fetchInitialData
    };

    return service;

    ////////////////
    function fetchInitialData() {
      return $http.get('/data/data.json')
        .then(
          function (res) {
            return res.data;
          },
          function (err) {
            console.error('Error while fetching data!');
            return $q.reject(err);
          }
        )
    }
  }
})();