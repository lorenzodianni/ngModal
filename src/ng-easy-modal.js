'use strict';

(() => {
  function EasyModalDelegate() {
    let __currents = {};

    let service = {
      show,
      status,
      get,
      close
    };

    return service;

    function EasyModal() {
      this.status = arguments[0].status || arguments[0];
      this.title = arguments[0].title || arguments[1];
      this.body = arguments[0].body || arguments[2];
      this.buttons = arguments[0].buttons || arguments[3];
      this.clickOut = arguments[0].clickOut || arguments[4] || false;
    }

    function show() {
      __currents[arguments[0].status] = new EasyModal(arguments[0]);
    }

    function close() {
      let keys = Object.keys(__currents);
      let lastIndex = keys.length - 1;
      let lastOne = keys[lastIndex];

      delete __currents[lastOne];
    }

    function status(easyModal) {
      return __currents[easyModal];
    }

    function get(key) {
      if(Object.keys(__currents).length) {

        for(let easyModal in __currents) {
          return __currents[easyModal][key];
        }

      }
    }

  }

  function EasyModalDirective() {
    return {
      scope: {
        easyModal: '=ngIf',
        resetTemplate: '='
      },
      bindToController: true,
      controller: ['EasyModalDelegate', EasyModalController],
      controllerAs: 'vm',
      transclude: true,
      replace: true,
      template: `
        <div class="easy-modal">
          <div class="easy-modal-box" ng-class="{'is-large': !vm.resetTemplate}">
            <div class="easy-modal-box--head" ng-if="!vm.resetTemplate">{{vm.easyModal.title}}</div>
            <div class="easy-modal-box--body" ng-if="!vm.resetTemplate">
              <p>{{vm.easyModal.body}}</p>
              <div ng-transclude></div>
            </div>
            <div class="easy-modal-box--footer" ng-if="!vm.resetTemplate">
              <button class="easy-modal-box--footer-btn"
                ng-repeat="button in vm.easyModal.buttons"
                ng-click="button.action($event)">
                {{button.label}}
              </button>
            </div>
            <div ng-transclude ng-if="vm.resetTemplate"></div>
          </div>
          <div class="easy-modal-close" ng-click="vm.easyModal.clickOut ? vm.close() : vm.easyModal.clickOut"></div>
        </div>
      `
    };

    function EasyModalController(EasyModalDelegate) {
      /*jshint validthis:true */
      this.get = EasyModalDelegate.get;
      this.close = EasyModalDelegate.close;
    }
  }

  angular
  .module('ngEasyModal', [])
  .factory('EasyModalDelegate', [EasyModalDelegate])
  .directive('easyModal', [EasyModalDirective]);
})();
