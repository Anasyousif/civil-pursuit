;(function () {

  module.exports = ['$rootScope', '$compile', 'DataFactory', NavigatorComponent];

  function compile (item, into, scope, $compile) {

    function _compile (type) {

      var tpl = '<div ' +
        ' data-type    =   "' + type + '" ' +
        ' data-parent  =   "' + item._id + '"' +
        ' class        =   "navigator"></div>';

      return $compile(tpl)(scope);
    }

    var has = synapp['item relation'][item.type];

    console.log(has);

    if ( has ) {
      var row = $('<div class="row"></div>'),
        target = into.find('.children');

      if ( Array.isArray( has ) ) {
        has.forEach(function (type) {

          if ( Array.isArray( type ) ) {
            var col1 = $('<div class="col-xs-6 split-view"></div>');
            col1.append(_compile(type[0]));
            
            var col2 = $('<div class="col-xs-6 split-view"></div>');
            col2.append(_compile(type[1]));
            
            row.append(col1, col2);
            target.append(row);
          }

          else {
            target.append(_compile(type));
          }
        });
      }

      else {
        target.append(_compile(has));
      }
    }

    return true;
  }

  function NavigatorComponent ($rootScope, $compile, DataFactory) {
    return {
      restrict: 'C',
      templateUrl: '/templates/navigator',
      scope: {
        type:' @',
        parent: '@'
      },
      controller: ['$scope', function ($scope) {
        $scope.loadChildren = function (item_id) {

          var item = $rootScope.items.reduce(function (item, _item) {
            if ( _item._id === item_id ) {
              item = _item;
            }
            return item;
          }, null);

          var scope = $scope.$new();

          compile(item, $('#item-' + item_id), scope, $compile);

          // DataFactory.Item.find({ parent: item_id })
          //   .success(function (items) {
          //     $rootScope.feedbacks = $rootScope.feedbacks.concat(feedbacks);
          //   });
        };
        
      }],
      link: function ($scope, $elem, $attrs) {
      }
    };
  }

})();