'use strict';

(() => {
  function EasyModalDelegate() {
    let service = {
      show,
      close,
      status,
      get,
      current: {
        status: null,
        title: null,
        body: null,
        buttons: null,
        clickOut: false
      }
    };

    return service;

    function show() /* value, title, body, buttons, clickOut */{
      service.current.status = arguments[0].status || arguments[0];
      service.current.title = arguments[0].title || arguments[1];
      service.current.body = arguments[0].body || arguments[2];
      service.current.buttons = arguments[0].buttons || arguments[3];
      service.current.clickOut = arguments[0].clickOut || arguments[4] || false;
    }

    function close() {
      for (let key in service.current) {
        return key === 'clickOut'
        ? service.current[key] = false
        : service.current[key] = null;
      }
    }

    function status(value) {
      return service.current.status === value;
    }

    function get(key) {
      return service.current[key];
    }
  }

  function EasyModalDirective() {
    return {
      scope: {},
      bindToController: true,
      controller: ['EasyModalDelegate', EasyModalController],
      controllerAs: 'easyModal',
      transclude: true,
      template: `
        <div class="modal">
          <div class="modal-head">{{easyModal.get('title')}}</div>
          <div class="modal-body">
            {{easyModal.get('body')}}
            <div ng-transclude></div>
          </div>
          <div class="modal-footer">
            <button class="button"
              ng-repeat="button in easyModal.get('buttons')"
              ng-click="button.action(); easyModal.close();">
              {{button.label}}
            </button>
          </div>
        </div>
        <div class="modal-close" ng-click="easyModal.get('clickOut') ? easyModal.close() : easyModal.get('clickOut')"></div>
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
