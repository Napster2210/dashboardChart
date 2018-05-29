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

    $scope.initialData = [];
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
          $scope.initialData = data;
          generateChartData();
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
    function generateChartData() {
      var tempResult = {
        "Total": $scope.initialData.length,
        "Cancel": {
          "Approved": 0,
          "Pending": 0,
          "Total": 0
        },
        "Renewal": {
          "Approoved": 0,
          "Pending": 0,
          "Total": 0
        },
        "New": {
          "Approved": 0,
          "Pending": 0,
          "Total": 0
        }
      };
      var totalStatus = _.map($scope.initialData, function (obj) {
        switch (obj.GatepassRenwalCancelStatus) {
          case 'RenewalApproved':
            tempResult.Renewal.Total++
            tempResult.Renewal.Approoved++;
            break;
          case 'RenewalPending':
            tempResult.Renewal.Total++;
            tempResult.Renewal.Pending++;
            break;
          case 'CancelApproved':
            tempResult.Cancel.Total++;
            tempResult.Cancel.Approved++;
            break;
          case 'CancelPending':
            tempResult.Cancel.Total++;
            tempResult.Cancel.Pending++;
            break;
          case 'NewApproved':
            tempResult.New.Total++;
            tempResult.New.Approved++;
            break;
          case 'NewPending':
            tempResult.New.Total++;
            tempResult.New.Pending++;
            break;
          default:
            break;
        }
      });
      $scope.data = [
        {
          key: "Total",
          values: [
            {
              title: "Total",
              val: tempResult.Total,
              color: "#E6EE9C"
            }
          ]
        },
        {
          key: "Cancel",
          values: [
            {
              title: "Cancel",
              val: tempResult.Cancel.Total,
              color: "#90CAF9"
            },
            {
              title: "Pending",
              val: tempResult.Cancel.Pending,
              color: "#90CAF9",
              parentID: "Cancel"
            },
            {
              title: "Approved",
              val: tempResult.Cancel.Approved,
              color: "#90CAF9",
              parentID: "Cancel"
            },
          ]
        },
        {
          key: "Renewal",
          values: [
            {
              title: "Renewal",
              val: tempResult.Renewal.Total,
              color: "#CE93D8"
            },
            {
              title: "Pending",
              val: tempResult.Renewal.Pending,
              color: "#CE93D8",
              parentID: "Renewal"
            },
            {
              title: "Approved",
              val: tempResult.Renewal.Approoved,
              color: "#CE93D8",
              parentID: "Renewal"
            }
          ]
        },
        {
          key: "New",
          values: [
            {
              title: "New",
              val: tempResult.New.Total,
              color: "#80CBC4"
            },
            {
              title: "Pending",
              val: tempResult.New.Pending,
              color: "#80CBC4",
              parentID: "New"
            },
            {
              title: "Approved",
              val: tempResult.New.Approved,
              color: "#80CBC4",
              parentID: "New"
            }
          ]
        }
      ];
      $scope.dataSource = filterData(null);
      generateChart();
    }
    /**
     * To filter chart data
     * 
     * @param {any} name 
     * @returns 
     */
    function filterData(name) {
      var result = null;
      var tempData = _.cloneDeep($scope.data);
      if (name) {
        result = tempData.filter(function (item) {
          return item.key === name;
        });
      } else {
        var tempValues = [];
        result = _.map(tempData, function (obj) {
          tempValues = _.filter(obj.values, function (value) {
            return !_.has(value, 'parentID');
          });
          obj.values = tempValues;
          return obj;
        })
      }
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
          width: 580,
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
            $scope.dataSource = filterData(null);
          });
        }, 500);
      }
    }



    $scope.saveToImage = function () {
      saveSvgAsPng($("#total_gatepass").find('svg')[0], "gatePassChart.png", { backgroundColor: '#fff' });
    }

    activate();

  }
})();