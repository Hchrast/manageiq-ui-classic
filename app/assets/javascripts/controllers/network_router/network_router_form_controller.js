ManageIQ.angular.app.controller('networkRouterFormController', ['$http', '$scope', 'networkRouterFormId', 'miqService', function($http, $scope, networkRouterFormId, miqService) {
  var vm = this;

  vm.networkRouterModel = {
    name: '',
    cloud_subnet_id: '',
  };
  vm.formId = networkRouterFormId;
  vm.afterGet = false;
  vm.modelCopy = angular.copy( $scope.networkRouterModel );
  vm.model = "networkRouterModel";

  ManageIQ.angular.scope = $scope;

  if (networkRouterFormId == 'new') {
    vm.networkRouterModel.name = "";
    vm.networkRouterModel.enable_snat = true;
    vm.networkRouterModel.external_gateway = false;
    vm.networkRouterModel.cloud_subnet_id = null;
    vm.newRecord = true;
  } else {
    miqService.sparkleOn();

    $http.get('/network_router/network_router_form_fields/' + networkRouterFormId)
      .then(getNetworkRouterFormData)
      .catch(miqService.handleFailure);
  }

  vm.addClicked = function() {
    var url = 'create/new' + '?button=add';
    miqService.miqAjaxButton(url, vm.networkRouterModel, { complete: false });
  };

  vm.cancelClicked = function() {
    if (networkRouterFormId == 'new') {
      var url = '/network_router/create/new' + '?button=cancel';
    } else {
      var url = '/network_router/update/' + networkRouterFormId + '?button=cancel';
    }
    miqService.miqAjaxButton(url);
  };

  vm.saveClicked = function() {
    var url = '/network_router/update/' + networkRouterFormId + '?button=save';
    miqService.miqAjaxButton(url, vm.networkRouterModel, { complete: false });
  };

  vm.addInterfaceClicked = function() {
    miqService.sparkleOn();
    var url = '/network_router/add_interface/' + networkRouterFormId + '?button=add';
    miqService.miqAjaxButton(url, vm.networkRouterModel, { complete: false });
  };

  vm.removeInterfaceClicked = function() {
    miqService.sparkleOn();
    var url = '/network_router/remove_interface/' + networkRouterFormId + '?button=remove';
    miqService.miqAjaxButton(url, vm.networkRouterModel, { complete: false });
  };

  vm.resetClicked = function() {
    vm.networkRouterModel = angular.copy( vm.modelCopy );
    vm.angularForm.$setPristine(true);
    miqService.miqFlash("warn", "All changes have been reset");
  };

  vm.filterNetworkManagerChanged = function(id) {
    miqService.sparkleOn();
    $http.get('/network_router/network_router_networks_by_ems/' + id)
      .then(getNetworkRouterFormByEmsData)
      .catch(miqService.handleFailure);

    miqService.getProviderTenants(function(data) {
      vm.available_tenants = data.resources;
    })(id);
  };

  vm.filterCloudNetworkChanged = function(id) {
    miqService.sparkleOn();
    $http.get('/network_router/network_router_subnets_by_network/' + id)
      .then(getNetworkRouterFormByNetworkData)
      .catch(miqService.handleFailure);
  };

  function getNetworkRouterFormData(response) {
    var data = response.data;

    vm.afterGet = true;
    vm.available_networks = data.available_networks;
    vm.available_subnets = data.available_subnets;
    vm.networkRouterModel.name = data.name;
    vm.networkRouterModel.cloud_network_id = data.cloud_network_id;
    vm.networkRouterModel.cloud_subnet_id = data.cloud_subnet_id;
    vm.networkRouterModel.ems_id = data.ems_id;
    vm.networkRouterModel.enable_snat = data.enable_snat;
    vm.networkRouterModel.external_gateway = data.external_gateway;

    vm.modelCopy = angular.copy( vm.networkRouterModel );
    miqService.sparkleOff();
  }

  function getNetworkRouterFormByEmsData(response) {
    var data = response.data;

    vm.available_networks = data.available_networks;
    miqService.sparkleOff();
  }

  function getNetworkRouterFormByNetworkData(response) {
    var data = response.data;

    vm.available_subnets = data.available_subnets;
    miqService.sparkleOff();
  }
}]);
