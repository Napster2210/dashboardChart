(function () {
  'use strict';

  angular
    .module('dashboardApp')
    .controller('DashboardController', DashboardController);

  /**
   * Dahsbaord controller
   * 
   * @param {any} $scope Scope of controller
   * @param {any} DashbaordService Service to handle functionality of dashboard
   */
  function DashboardController($scope, DashbaordService) {

    $scope.data = [];
    $scope.dataSource = [];
    $scope.isFirstLevel = true;

    /**
     * Initialization function
     * 
     */
    function activate() {
      DashbaordService.fetchInitialData().then(
        function (data) {
          generateChartData(data);
        },
        function (error) {
          console.error('Error while fetching data!');
        }
      );
    }
    /**
     * To generate chart data
     * 
     * @param {any} data Data from backend
     */
    function generateChartData(data) {
      var totalGatePass = 0, totalCancelPass = 0, totalRenewalPass = 0, totalNewPass = 0;
      var totalStatus = _.map(data, function (obj) {
        return obj.GatepassRenwalCancelStatus.split(/(?=[A-Z])/);
      });
      totalGatePass = totalStatus.length;
      _.map(totalStatus, function (obj, index) {
        if (obj[0] === 'Renewal') {
          totalRenewalPass++;
        } else if (obj[0] === 'New') {
          totalNewPass++;
        } else if (obj[0] === 'Cancel') {
          totalCancelPass++;
        }
      });

      $scope.data = [
        {
          key: "Total",
          values: [
            {
              title: "Total",
              val: totalGatePass,
              parentID: "",
              color: "#E6EE9C"
            }
          ]
        },
        {
          key: "Cancel",
          values: [
            {
              title: "Cancel",
              val: totalCancelPass,
              parentID: "",
              color: "#90CAF9"
            }
          ]
        },
        {
          key: "Renewal",
          values: [
            {
              title: "Renewal",
              val: totalRenewalPass,
              parentID: "",
              color: "#CE93D8"
            }
          ]
        },
        {
          key: "New",
          values: [
            {
              title: "New",
              val: totalNewPass,
              parentID: "",
              color: "#80CBC4"
            }
          ]
        }
      ];
      // $scope.dataSource = filterData("");
      $scope.dataSource = $scope.data;
      generateChart();
    }
    /**
     * To filter chart data
     * 
     * @param {any} name 
     * @returns 
     */
    function filterData(name) {
      var result = [{
        // key: 'Drill-down data',
        values: []
      }];
      var data = $scope.data[0].values;
      var values = data.filter(function (item) {
        return item.parentID === name;
      });
      result[0].values = values;
      return result;
    }
    /**
     * To generate chart configuration
     * 
     */
    function generateChart() {
      $scope.options = {
        chart: {
          type: 'discreteBarChart',
          height: 400,
          width: 600,
          margin: {
            top: 50,
            right: 20,
            bottom: 50,
            left: 50
          },
          showLegend: true,
          showValues: true,
          x: function (d) { return d.title; },
          y: function (d) { return d.val; },
          valueFormat: function (d) {
            return d;
          },
          duration: 800,
          xAxis: {
            axisLabel: 'Gate Pass Status'
          },
          yAxis: {
            axisLabel: 'No. of Gate Passes',
            axisLabelDistance: -10,
            showMinMax: false
          },
          discretebar: {
            margin: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 35
            },
            colour: function () {
              return '#969696';
            },
            dispatch: {
              elementClick: function (e) {
                if ($scope.isFirstLevel) {
                  setTimeout(function () {
                    $scope.$apply(function () {
                      $scope.isFirstLevel = false;
                      $scope.dataSource = filterData(e.data.title);
                    });
                  }, 500);
                }
              }
            }
          }
        }
      };
    }

    $scope.backHandler = function () {
      if (!$scope.isFirstLevel) {
        setTimeout(function () {
          $scope.$apply(function () {
            $scope.isFirstLevel = true;
            $scope.dataSource = filterData("");
          });
        }, 500);
      }
    }

    activate();

  }
})();